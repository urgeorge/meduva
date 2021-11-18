package com.szusta.meduva.service.visit;

import com.szusta.meduva.exception.EntityRecordNotFoundException;
import com.szusta.meduva.model.Room;
import com.szusta.meduva.model.Service;
import com.szusta.meduva.model.UnregisteredClient;
import com.szusta.meduva.model.User;
import com.szusta.meduva.model.schedule.visit.Visit;
import com.szusta.meduva.payload.Term;
import com.szusta.meduva.repository.RoomRepository;
import com.szusta.meduva.repository.UnregisteredClientRepository;
import com.szusta.meduva.repository.schedule.visit.VisitRepository;
import com.szusta.meduva.service.freetimescanner.FreeTimeScanner;
import com.szusta.meduva.service.freetimescanner.NotAvailableException;
import com.szusta.meduva.util.TimeUtils;

import javax.transaction.Transactional;
import java.util.*;

@org.springframework.stereotype.Service
public class VisitService {

    private VisitRepository visitRepository;
    private VisitBuilder visitBuilder;

    private RoomRepository roomRepository;
    private UnregisteredClientRepository unregisteredClientRepository;

    private VisitScheduleGenerator visitScheduleGenerator;

    private FreeTimeScanner freeTimeScanner;

    public VisitService(VisitRepository visitRepository,
                        VisitBuilder visitBuilder,
                        RoomRepository roomRepository,
                        UnregisteredClientRepository unregisteredClientRepository,
                        VisitScheduleGenerator visitScheduleGenerator,
                        FreeTimeScanner freeTimeScanner) {
        this.visitRepository = visitRepository;
        this.visitBuilder = visitBuilder;
        this.roomRepository = roomRepository;
        this.unregisteredClientRepository = unregisteredClientRepository;
        this.visitScheduleGenerator = visitScheduleGenerator;
        this.freeTimeScanner = freeTimeScanner;
    }

    public Visit findById(Long visitId) {
        return visitRepository.findById(visitId)
                .orElseThrow(() -> new EntityRecordNotFoundException("Visit not found with id " + visitId));
    }

    public List<Date> getWorkerAvailableDaysOfMonth(User worker,
                                                    Service service,
                                                    Date anyDayOfMonth) {
        checkIfCanPerform(worker, service);
        setAuxiliaryData(worker, service);

        List<Date> availableDaysOfMonth = new ArrayList<>();

        Date monthStart = TimeUtils.getMonthStart(anyDayOfMonth);
        Calendar currentDay = TimeUtils.getCalendar(monthStart);
        Calendar nextMonthStart = TimeUtils.getCalendar(
                TimeUtils.getNextMonthStart(anyDayOfMonth));
        do {
            if (freeTimeScanner.isWorkerDayAvailable(currentDay)) {
                availableDaysOfMonth.add(currentDay.getTime());
            }
            currentDay.add(Calendar.DAY_OF_MONTH, 1);
        } while (currentDay.before(nextMonthStart));

        return availableDaysOfMonth;
    }

    private void setAuxiliaryData(User worker, Service service) {
        List<Room> suitableRooms = getSuitableRooms(service);
        freeTimeScanner.setWorker(worker);
        freeTimeScanner.setService(service);
        freeTimeScanner.setRooms(suitableRooms);
    }

    private void checkIfCanPerform(User worker, Service service) {
        if (!worker.canPerform(service)) {
            throw new RuntimeException("Cannot find available month days for visit: given worker cannot perform given service");
        }
    }

    private List<Room> getSuitableRooms(Service service) {
        List<Room> suitableRooms = roomRepository.findAllSuitableForService(service.getId());
        if (suitableRooms.isEmpty()) {
            throw new RuntimeException("Cannot find available days of month: no room suitable for a given service exist");
        } else {
            return suitableRooms;
        }
    }

    public List<Term> getWorkerAvailableTermsForDay(User worker, Service service, Date day) {
        try {
            checkIfCanPerform(worker, service);
            setAuxiliaryData(worker, service);
            return freeTimeScanner.getWorkerPossibleTerms(day);
        } catch (NotAvailableException ex) {
            throw new RuntimeException("Worker doesn't have work hours on " + day);
        }
    }

    @Transactional
    public Optional<Visit> saveNewVisit(Term term) {
        Visit visit = visitBuilder.buildVisit(term);
        visit = visitRepository.findById(visit.getId())
                .orElseThrow(() -> new EntityRecordNotFoundException("Visit wasn't saved"));
        visitScheduleGenerator.generateVisitSchedules(visit);
        return Optional.of(visit);
    }


    public List<Visit> findAllWhereUserIsClient(User client) {
        return visitRepository.findAllWhereUserIsClient(client.getId());
    }

    public List<Visit> findAllWhereUserIsWorker(User worker) {
        return visitRepository.findAllWhereUserIsWorker(worker.getId());
    }

    public List<Visit> findAllOfUnregisteredClient(Long unregisteredClientId) {
        UnregisteredClient unregisteredClient = unregisteredClientRepository.findById(unregisteredClientId)
                .orElseThrow(() -> new EntityRecordNotFoundException("Cannot find visits: unregistered client not found with id " + unregisteredClientId));
        return visitRepository.findByUnregisteredClient(unregisteredClient);
    }
}

package com.szusta.meduva.controller;

import com.szusta.meduva.model.Room;
import com.szusta.meduva.model.Service;
import com.szusta.meduva.model.User;
import com.szusta.meduva.model.schedule.RoomSchedule;
import com.szusta.meduva.model.schedule.visit.Visit;
import com.szusta.meduva.payload.TimeRange;
import com.szusta.meduva.payload.request.DeleteDailyHoursRequest;
import com.szusta.meduva.payload.request.add.NewRoomRequest;
import com.szusta.meduva.service.room.RoomService;
import com.szusta.meduva.service.visit.VisitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/room")
public class RoomController {

    private RoomService roomService;
    private VisitService visitService;

    @Autowired
    public RoomController(RoomService roomService, VisitService visitService) {
        this.roomService = roomService;
        this.visitService = visitService;
    }


    @GetMapping("/all")
    public List<Room> findAllRooms() {
        return this.roomService.findAllRooms();
    }

    @GetMapping("/all/undeleted")
    public List<Room> findAllUndeletedRooms() {
        return this.roomService.findAllUndeletedRooms();
    }

    @GetMapping("/room/doesExistWithName/{roomName}")
    public boolean doesExist(@PathVariable String roomName) {
        return roomService.doesRoomExistByName(roomName);
    }

    @PostMapping
    public Room addRoom(@RequestBody NewRoomRequest request) {
        Room room = new Room(
                request.getName(),
                request.getDescription(),
                request.isDeleted()
        );
        return this.roomService.saveNewRoom(room);
    }

    @PostMapping("/{id}/edit-services")
    public Room editServices(@PathVariable final Long id, @RequestBody final List<Service> editedServicesList){
        Room room = this.roomService.findById(id);
        List<Service> services = room.getServices();
        services = services.stream().filter(service -> !service.isItemless()).collect(Collectors.toList());
        services.addAll(editedServicesList);
        room.setServices(services);
        return this.roomService.editRoomServices(room);
    }

    @DeleteMapping("/{id}")
    public void deleteRoom(@PathVariable Long id) {
        this.roomService.markAsDeleted(id);
    }

    @DeleteMapping("/all")
    public void deleteAllRoomsPermanently() {
        this.roomService.deleteAllRoomsPermanently();
    }

    @PostMapping("/get-weekly-unavailability/{roomId}")
    public List<TimeRange> getItemWeeklyUnavailability(@PathVariable Long roomId, @RequestBody TimeRange weekBoundaries) {
        Room room = roomService.findById(roomId);
        return roomService.getRoomWeeklyUnavailability(room, weekBoundaries);
    }

    @PostMapping("/set-day-unavailability/{roomId}")
    public TimeRange setItemDayUnavailability(@PathVariable Long roomId, @RequestBody Date day) {
        RoomSchedule roomUnavailSchedule = roomService.setRoomDayUnavailability(roomId, day);
        return new TimeRange(roomUnavailSchedule.getTimeFrom(), roomUnavailSchedule.getTimeTo());
    }

    @DeleteMapping("/delete-day-unavailability/{roomId}")
    public void deleteDayUnavailability(@PathVariable Long roomId, @RequestBody DeleteDailyHoursRequest request){
        Date day = request.getDay();
        roomService.deleteDayUnavailability(roomId, day);
    }
    @GetMapping("/{roomId}/visits")
    public List<Visit> findAllIncomingRoomVisits(@PathVariable Long roomId) {
        return visitService.findAllIncomingWithRoomId(roomId);
    }
}

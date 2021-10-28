import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {CalendarEvent, CalendarView} from "angular-calendar";
import {MatDialog} from "@angular/material/dialog";
import {ActivatedRoute, Router} from "@angular/router";
import {DayDialogComponent} from "../../dialog/day-dialog/day-dialog.component";
import {User} from "../../../../model/user";
import {UserService} from "../../../../service/user.service";
import {ScheduleService, WeekBoundaries, WorkHours} from "../../../service/schedule.service";

import {getHours} from "date-fns";

@Component({
  selector: 'app-worker-schedule',
  changeDetection: ChangeDetectionStrategy.Default, // if strange bugs will occur, try using .OnPush
  templateUrl: './worker-schedule.component.html',
  styleUrls: ['./worker-schedule.component.css']
})
export class WorkerScheduleComponent implements OnInit {

  view: CalendarView = CalendarView.Week;
  viewDate: Date = new Date();

  events: CalendarEvent[] = [];

  clickedDate!: Date;
  clickedColumn!: number;

  worker!: User;

  firstDayOfWeek!: Date;
  lastDayOfWeek!: Date;

  dayStartHour: number = 6;
  dayEndHour: number = 20;

  constructor(
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private userService: UserService,
    private scheduleService: ScheduleService,
    ) {
  }

  ngOnInit(): void {
    let workerId = this.activatedRoute.snapshot.params.id;
    this.userService.getUserDetails(workerId).subscribe(
      worker => {
        this.worker = worker;
        this.prepareWeekEvents();
      }
    );
  }

  openDayDialog(date: Date) {
    this.clickedDate = date;
    const dayDialog = this.dialog.open(DayDialogComponent, {
      width: '400px',
      panelClass: 'my-dialog',
      data: { date: this.clickedDate }
    });

    dayDialog.afterClosed().subscribe(
      result => {
        if (result.event == 'WORK_HOURS') {
          let workHoursToSave: WorkHours = result.data;
          this.saveWorkHours(workHoursToSave);
        }
      }
    );
  }

  private saveWorkHours(workHoursToSave: WorkHours) {
    this.scheduleService.saveWorkHours(this.worker.id, workHoursToSave).subscribe(
      workHours => {
        this.prepareWeekEvents();
      }, err => {
        console.log(err);
      }
    );
  }

  prepareWeekEvents() {
    this.events = [];
    this.setFirstAndLastDayOfWeek();
    this.prepareWeeklyOffWorkHours();
  }

  private setFirstAndLastDayOfWeek() {
    let currDate = new Date(this.viewDate);
    let firstDayOfWeekNumber = currDate.getDate() - currDate.getDay();
    this.firstDayOfWeek = new Date(currDate.setDate(firstDayOfWeekNumber));
    this.lastDayOfWeek = new Date(currDate.setDate(this.firstDayOfWeek.getDate() + 6));
  }

  private prepareWeeklyOffWorkHours(): void {
    let weekBoundaries: WeekBoundaries = {
      firstWeekDay: this.firstDayOfWeek,
      lastWeekDay: this.lastDayOfWeek
    };

    this.scheduleService.getWeeklyOffWorkHours(this.worker.id, weekBoundaries).subscribe(
    (weeklyOffWorkHours: WorkHours[]) => {
      this.updateWorkHoursEvents(weeklyOffWorkHours);
    });
  }

  private updateWorkHoursEvents(weeklyOffWorkHours: WorkHours[]) {
    let newEvents = this.events;
    this.events = [];
    weeklyOffWorkHours.forEach(OffWorkHours => {
      newEvents.push({
        draggable: false,
        end: new Date(OffWorkHours.endTime),
        id: undefined,
        meta: undefined,
        start: new Date(OffWorkHours.startTime),
        title: "Off work",
        color: {
          primary: "lightGray",
          secondary: "lightGray"
        }
      })
    });
    this.events = [...newEvents];
  }

  eventClick($event: { event: CalendarEvent<any>; sourceEvent: any }) {

  }
}

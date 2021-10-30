import { Component, OnInit } from '@angular/core';
import {CalendarEvent, CalendarView} from "angular-calendar";
import {ActivatedRoute} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {EquipmentItem} from "../../../../model/equipment";
import {EquipmentService} from "../../../../service/equipment.service";
import {ScheduleService, TimeRange} from "../../../service/schedule.service";
import {ItemDayDialogComponent, UnavailabilityOptions} from "../../dialog/item-day-dialog/item-day-dialog.component";
import {createUnavailabilityEvent} from "../../../util/event/creation";

@Component({
  selector: 'app-item-schedule',
  templateUrl: './item-schedule.component.html',
  styleUrls: ['./item-schedule.component.css']
})
export class ItemScheduleComponent implements OnInit {

  view: CalendarView = CalendarView.Week;
  viewDate: Date = new Date();

  events: CalendarEvent[] = [];

  clickedDate!: Date;
  clickedColumn!: number;

  item!: EquipmentItem;

  firstDayOfWeek!: Date;
  lastDayOfWeek!: Date;

  dayStartHour: number = 6;
  dayEndHour: number = 20;

  constructor(
    private itemService: EquipmentService,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private scheduleService: ScheduleService
  ) { }

  ngOnInit(): void {
    let itemId = this.activatedRoute.snapshot.params.id;
    this.itemService.getItemById(itemId).subscribe(
      item => {
        this.item = item;
        this.getWeeklyEvents();
      }
    );
  }

  private getWeeklyEvents() {
    this.events = [];
    this.setFirstAndLastDayOfWeek();
    this.pushWeeklyUnavailability();
  }

  private setFirstAndLastDayOfWeek() {
    let currDate = new Date(this.viewDate);
    let firstDayOfWeekNumber = currDate.getDate() - currDate.getDay();
    this.firstDayOfWeek = new Date(currDate.setDate(firstDayOfWeekNumber));
    this.lastDayOfWeek = new Date(currDate.setDate(this.firstDayOfWeek.getDate() + 6));
  }

  private pushWeeklyUnavailability(): void {
    let weekBoundaries: TimeRange = {
      startTime: this.firstDayOfWeek,
      endTime: this.lastDayOfWeek
    };

    // @ts-ignore
    this.scheduleService.getWeeklyItemUnavailability(this.item.id, weekBoundaries).subscribe(
      (weeklyUnavailability: TimeRange[]) => {
        this.pushUnavailabilities(weeklyUnavailability);
      });
  }

  private pushUnavailabilities(weeklyUnavailability: TimeRange[]) {
    let newEvents = this.events;
    weeklyUnavailability.forEach(unavailability => {
      newEvents.push(
        createUnavailabilityEvent(unavailability.startTime, unavailability.endTime)
      );
    });
    this.events = [];
    this.events = [...newEvents];
  }

  openDayDialog(date: Date) {
    this.clickedDate = date;
    const dayDialog = this.dialog.open(ItemDayDialogComponent, {
      width: '400px',
      panelClass: 'my-dialog',
      data: { date: this.clickedDate }
    });

    dayDialog.afterClosed().subscribe(
      result => {
        if (result.event == 'UNAVAILABILITY_SET') {
          let selectedOption: number = result.data;
          this.setUnavailability(selectedOption);
        }
      }
    );
  }

  private setUnavailability(selectedOption: number) {

    if (selectedOption == UnavailabilityOptions.THAT_DAY) {
      // @ts-ignore
      this.scheduleService.setItemDayUnavailability(this.item.id, this.clickedDate).subscribe(
        (dayTimeRange: TimeRange) => {
          console.log(dayTimeRange); // git gud
          this.pushUnavailableDayToEvents(dayTimeRange);
        }
      )
    }
  }

  private pushUnavailableDayToEvents(dayTimeRange: TimeRange) {
    let newEvents = this.events;
    newEvents.push({
      draggable: false,
      end: new Date(dayTimeRange.endTime),
      id: undefined,
      meta: undefined,
      start: new Date(dayTimeRange.startTime),
      title: "Unavailable",
      color: {
        primary: "#FF9191",
        secondary: "#FF9191"
      }
    });
    this.events = [];
    this.events = [...newEvents];
  }

  eventClick($event: {event: CalendarEvent<any>; sourceEvent: any}) {

  }
}

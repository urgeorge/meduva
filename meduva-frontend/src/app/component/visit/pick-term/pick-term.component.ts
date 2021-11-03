import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, EventEmitter,
  Inject,
  OnDestroy,
  OnInit, Output,
  ViewEncapsulation
} from '@angular/core';
import {Term, VisitService} from "../../../service/visit.service";
import {DatePipe, formatDate} from "@angular/common";
import {Router} from "@angular/router";
import {ServicesService} from "../../../service/services.service";
import {Service} from "../../../model/service";
import {MatCalendar} from "@angular/material/datepicker";
import {User} from "../../../model/user";
import {Subject} from "rxjs";
import {DateAdapter, MAT_DATE_FORMATS, MatDateFormats} from "@angular/material/core";
import {takeUntil} from "rxjs/operators";
import {addMonth, DateUtil, substractMonth} from "../../../util/date";
import {locale} from "moment";

@Component({
  selector: 'app-pick-term',
  templateUrl: './pick-term.component.html',
  styleUrls: ['./pick-term.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class PickTermComponent implements OnInit {

  selectedService!: Service | null;
  selectedWorker!: User | null;
  canChooseTerm: boolean = false;

  generatingTerms: boolean = false;
  canSelectHour: boolean = false;

  availableTerms: Term[] = [];
  displayedColumns: string[] = ["date"];

  errorMessage: string = '';

  asyncHeader = AsyncDatePickerHeader;

  dateFilter = (date: Date | null): boolean => {
    let availableDates = this.visitService.getAvailableDates();
    console.log(availableDates);

    /*
    const filteredDayNumber = (date || new Date()).getDate();
    let isAvailable = false;
    availableDates.forEach(availDate => {
      if (availDate.getDate() == filteredDayNumber)
        isAvailable = true;
    });
    return isAvailable;*/
    return true;
    /*
    if (date != null) {
      if (isMonthSame(date, this.openDates[0])) {
        return this.openDates.includes(date);
      } else {
        return false;
      }
    } else {
      return false;
    }
     */
  };

  /*
  dayChecker: MatCalendarCellClassFunction<Date> = async (cellDate, view) => {
    if (view === 'month') {

      let hasTerms: boolean = true;
      if (this.workerHasBeenSelected()) {
        // TODO: check if selected worker can do that service given day
        let workerId = this.selectedWorker?.id;
        let serviceId = this.selectedService?.id;
        if (workerId && serviceId) {
          hasTerms = await this.visitService.isWorkerAvailable(workerId, serviceId, cellDate);
        }
      } else {
        // TODO: check if service can be performed given day by anyone

      }
      console.log(hasTerms);
      return hasTerms ? 'free-date' : 'not-available-date';
    }
    console.log("returning nothing");
    return '';
  }

   */

  constructor(
    private visitService: VisitService,
    private servicesService: ServicesService,
    private datePipe: DatePipe,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.selectedService = this.visitService.getSelectedService();
    if (this.serviceHasBeenSelected()) {
      let activeDate = new Date();
      let activeDateStr = formatDate(activeDate, 'YYYY-MM-dd HH:mm:ss', locale());

      let serviceId = this.visitService.getSelectedService()?.id;
      let workerId: number | undefined = this.visitService.getSelectedWorker()?.id;
      if (workerId != undefined && serviceId) {
        // TODO: check if selected worker can do that service given day
        this.visitService.getWorkerAvailableDaysInMonth(workerId, serviceId, activeDateStr).subscribe(
          availDays => {
            this.visitService.saveAvailableDates(availDays);
            this.canChooseTerm = true;
          }
        );
      } else {
        // TODO: check if service can be performed given day by anyone
        // this.visitService.getAvailableDaysInMonth(serviceId, activeDate);
      }
    }
    this.selectedWorker = this.visitService.getSelectedWorker();
  }

  private serviceHasBeenSelected(): boolean {
    return this.selectedService != null && this.selectedService.id != null;
  }

  private workerHasBeenSelected(): boolean {
    return this.selectedWorker != null;
  }

  private getTermsForService(serviceId: number) {
    this.servicesService.getTermsForService(serviceId).subscribe(
      terms => {
        this.availableTerms = terms;
        this.generatingTerms = false;
      },
      err => {
        this.errorMessage = err.error.message;
        this.generatingTerms = false;
      }
    );
  }

  selectTerm(term: Term) {
    this.visitService.saveSelectedTerm(term);
    this.router.navigate(['/visit/pick-client']);
  }
}

/** Custom header component for datepicker. */
@Component({
  selector: 'async-header',
  styles: [`
    .example-header {
      display: flex;
      align-items: center;
      padding: 0.5em;
    }

    .example-header-label {
      flex: 1;
      height: 1em;
      font-weight: 500;
      text-align: center;
    }

    .example-double-arrow .mat-icon {
      margin: -22%;
    }
  `],
  template: `
    <div class="example-header">
      <button mat-icon-button class="example-double-arrow" (click)="previousClicked('year')">
        <mat-icon>keyboard_arrow_left</mat-icon>
        <mat-icon>keyboard_arrow_left</mat-icon>
      </button>
      <button mat-icon-button (click)="previousClicked('month')">
        <mat-icon>keyboard_arrow_left</mat-icon>
      </button>
      <span class="example-header-label">{{periodLabel}}</span>
      <button mat-icon-button (click)="nextClicked('month')">
        <mat-icon>keyboard_arrow_right</mat-icon>
      </button>
      <button mat-icon-button class="example-double-arrow" (click)="nextClicked('year')">
        <mat-icon>keyboard_arrow_right</mat-icon>
        <mat-icon>keyboard_arrow_right</mat-icon>
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsyncDatePickerHeader<D> implements OnInit, OnDestroy {
  private _destroyed = new Subject<void>();

  availableDays: Date[] = [];

  constructor(
    private _calendar: MatCalendar<D>, private _dateAdapter: DateAdapter<D>,
    @Inject(MAT_DATE_FORMATS) private _dateFormats: MatDateFormats, cdr: ChangeDetectorRef,
    private visitService: VisitService,
    private dateUtil: DateUtil
    ) {
    _calendar.stateChanges
      .pipe(takeUntil(this._destroyed))
      .subscribe(() => cdr.markForCheck());
  }

  ngOnInit() {
  }

  getAvailableDaysInMonth() {
    // TODO: backend call
    // @ts-ignore
    let activeDate = new Date(this._calendar.activeDate);
    let activeDateStr = formatDate(activeDate, 'YYYY-MM-dd HH:mm:ss', locale());

    this.availableDays = [];
    let serviceId = this.visitService.getSelectedService()?.id;
    let workerId: number | undefined = this.visitService.getSelectedWorker()?.id;
    if (workerId != undefined && serviceId) {
      // TODO: check if selected worker can do that service given day
      this.visitService.getWorkerAvailableDaysInMonth(workerId, serviceId, activeDateStr).subscribe(
        availDays => {
          this.availableDays = availDays;
          this.visitService.saveAvailableDates(this.availableDays);
        }
      );
    } else {
      // TODO: check if service can be performed given day by anyone
      // this.visitService.getAvailableDaysInMonth(serviceId, activeDate);
    }
  }

  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
  }

  get periodLabel() {
    return this._dateAdapter
      .format(this._calendar.activeDate, this._dateFormats.display.monthYearLabel)
      .toLocaleUpperCase();
  }

  previousClicked(mode: 'month' | 'year') {

    // @ts-ignore
    let dateToSend = new Date(this._calendar.activeDate);
    dateToSend = substractMonth(dateToSend);
    let dateToSendStr = formatDate(dateToSend, 'YYYY-MM-dd HH:mm:ss', locale());

    let serviceId = this.visitService.getSelectedService()?.id;
    let workerId: number | undefined = this.visitService.getSelectedWorker()?.id;
    if (workerId != undefined && serviceId) {
      // TODO: check if selected worker can do that service given day
      this.visitService.getWorkerAvailableDaysInMonth(workerId, serviceId, dateToSendStr).subscribe(
        availDays => {
          this.visitService.saveAvailableDates(availDays);

          this._calendar.activeDate = mode === 'month' ?
            this._dateAdapter.addCalendarMonths(this._calendar.activeDate, -1) :
            this._dateAdapter.addCalendarYears(this._calendar.activeDate, -1);
        }
      );
    } else {
      // TODO: check if service can be performed given day by anyone
      // this.visitService.getAvailableDaysInMonth(serviceId, activeDate);
    }
  }

  nextClicked(mode: 'month' | 'year') {

    // @ts-ignore
    let dateToSend = new Date(this._calendar.activeDate);
    dateToSend = addMonth(dateToSend);
    let dateToSendStr = formatDate(dateToSend, 'YYYY-MM-dd HH:mm:ss', locale());

    let serviceId = this.visitService.getSelectedService()?.id;
    let workerId: number | undefined = this.visitService.getSelectedWorker()?.id;
    if (workerId != undefined && serviceId) {
      // TODO: check if selected worker can do that service given day
      this.visitService.getWorkerAvailableDaysInMonth(workerId, serviceId, dateToSendStr).subscribe(
        availDays => {
          this.visitService.saveAvailableDates(availDays);

          this._calendar.activeDate = mode === 'month' ?
            this._dateAdapter.addCalendarMonths(this._calendar.activeDate, 1) :
            this._dateAdapter.addCalendarYears(this._calendar.activeDate, 1);
        }
      );
    } else {
      // TODO: check if service can be performed given day by anyone
      // this.visitService.getAvailableDaysInMonth(serviceId, activeDate);
    }
  }
}

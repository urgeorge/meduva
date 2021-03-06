import { Component, OnInit } from '@angular/core';
import {roleNames, User, UserRole} from "../../../model/user";
import {Client} from "../../../model/client";
import {Service} from "../../../model/service";
import {Term, VisitService} from "../../../service/visit.service";
import {JwtStorageService} from "../../../service/token/jwt-storage.service";
import {UserService} from "../../../service/user.service";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {FeedbackDialogComponent} from "../../dialog/feedback-dialog/feedback-dialog.component";
import {RoleGuardService} from "../../../service/auth/role-guard.service";
import {ConfirmationDialogComponent} from "../../dialog/confirmation-dialog/confirmation-dialog.component";
import {ChooseOptionDialogComponent} from "../../dialog/choose-option-dialog/choose-option-dialog.component";

@Component({
  selector: 'app-plan-your-visit',
  templateUrl: './plan-your-visit.component.html',
  styleUrls: ['./plan-your-visit.component.css']
})
export class PlanYourVisitComponent implements OnInit {

  currentUser!: User;

  worker!: User | null;
  client!: Client | null;
  service!: Service | null;

  isTermSelectionVisible = false;
  term!: Term | null;
  visitDescription: string = "";
  asReceptionist = false;

  constructor(
    private jwtStorage: JwtStorageService,
    private userService: UserService,
    private visitService: VisitService,
    private dialog: MatDialog,
    private router: Router,
    private roleGuardService: RoleGuardService,
  ) { }

  ngOnInit(): void {
    // @ts-ignore
    this.userService.getUserDetails(this.jwtStorage.getCurrentUser()?.id).subscribe(
      currUser => {
        this.currentUser = currUser;
        this.worker = currUser;
      }
    );
    if(this.ifCurrentUserIsRecepcionistOrAdmin()){ const optionDialogRef = this.dialog.open(ChooseOptionDialogComponent, {
      data: { message: 'For whom do u want to book an appointment?' , optionNo: 'For me', optionYes: 'For other worker'}
    });
      optionDialogRef.afterClosed().subscribe(confirmed => {
        if(confirmed){
          this.asReceptionist = true;
          this.worker=null;
        }
      });
    }


  }

  onClientSelection($event: any) {
    this.client = $event;
  }

  onServiceSelection($event: any) {
    this.service = $event;
    this.term = null;
  }

  onReRenderSignal($event: boolean) {
    this.isTermSelectionVisible = false;
  }

  makeTermSelectionVisible() {
    this.isTermSelectionVisible = true;
  }

  onTermSelection($event: Term) {
    this.term = $event;
  }

  onVisitSubmit(): void {
    this.visitService.saveVisit(this.term).subscribe(
      visitData => {
        this.openFeedbackDialog();
      }, err => {
        console.log(err);
      }
    )
  }

  private openFeedbackDialog() {
    const feedbackDialogRef = this.dialog.open(FeedbackDialogComponent, {
      data: {message: 'Visit has been saved.'}
    });

    feedbackDialogRef.afterClosed().subscribe(
      acknowledged => {
        this.router.navigate(['/visit-history']);
      }
    );
  }

  onDescriptionSave() {
    // @ts-ignore
    this.term?.description = this.visitDescription;
    console.log(this.term?.description);
  }

  onWorkerSelection($event: any) {
    this.worker = $event;
    this.term = null;
  }
  ifCurrentUserIsRecepcionistOrAdmin(){
    return (this.roleGuardService.hasCurrentUserExpectedRole(roleNames[UserRole.ROLE_RECEPTIONIST]) || this.roleGuardService.hasCurrentUserExpectedRole(roleNames[UserRole.ROLE_ADMIN]))

  }

  showWorker() {
    console.log(this.worker+"To jest worker teraz");
  }
}

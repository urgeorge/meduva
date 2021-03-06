import {RoleGuardService as RoleGuard} from "./service/auth/role-guard.service";
import {Routes} from "@angular/router";
import {HomeComponent} from "./component/home/home.component";
import {LoginComponent} from "./component/site-entry/login/login.component";
import {PasswordResetEmailInputComponent} from "./component/site-entry/login-data/password-reset-email-input/password-reset-email-input.component";
import {PasswordResetComponent} from "./component/site-entry/login-data/password-reset/password-reset.component";
import {RegisterComponent} from "./component/site-entry/register/register.component";
import {ProfileComponent} from "./component/user/profile/profile.component";
import {UserListComponent} from "./component/user/user-list/user-list.component";
import {roleNames, UserRole} from "./model/user";
import {AccessDeniedComponent} from "./component/access-denied/access-denied.component";
import {ServiceListComponent} from "./component/facility-resources/services/service-list/service-list.component";
import {NewServiceComponent} from "./component/facility-resources/services/new-service/new-service.component";
import {EditProfileComponent} from "./component/user/profile/edit-profile/edit-profile.component";
import {ServiceDetailsComponent} from "./component/facility-resources/services/service-details/service-details.component";
import {RoomListComponent} from "./component/facility-resources/rooms/room-list/room-list.component";
import {NewRoomComponent} from "./component/facility-resources/rooms/new-room/new-room.component";
import {RoomDetailsComponent} from "./component/facility-resources/rooms/room-details/room-details.component";
import {EditEmailComponent} from "./component/user/profile/edit-email/edit-email.component";
import {ActivateNewEmailComponent} from "./component/site-entry/login-data/activate-new-email/activate-new-email.component";
import {EquipmentListComponent} from "./component/facility-resources/equipment/equipment-list/equipment-list.component";
import {NewModelComponent} from "./component/facility-resources/equipment/new-model/new-model.component";
import {ModelDetailsComponent} from "./component/facility-resources/equipment/model-details/model-details.component";
import {SpecificUserComponent} from "./component/user/specific-user-profile/specific-user.component";
import {EditRoleComponent} from "./component/user/specific-user-profile/edit-role/edit-role.component";
import {WorkerServicesComponent} from "./component/user/specific-user-profile/worker-services/worker-services.component";
import {EditPerformedServicesComponent} from "./component/facility-resources/rooms/edit-performed-services/edit-performed-services.component";
import {ChangePasswordComponent} from "./component/user/profile/change-password/change-password.component";
import {CreatorComponent} from "./component/creator/creator.component";
import {NewModelCreatorComponent} from "./component/creator/assign-equipment/new-model-creator/new-model-creator.component";
import {ClientListComponent} from "./component/clients/client-list/client-list.component";
import {ClientDetailsComponent} from "./component/clients/client-details/client-details.component";
import {AddClientComponent} from "./component/clients/add-client/add-client.component";
import {EditClientComponent} from "./component/clients/client-details/edit-client/edit-client.component";
import {WorkerScheduleComponent} from "./schedule/component/worker/worker-schedule/worker-schedule.component";
import {PickWorkerComponent} from "./schedule/component/worker/pick-worker/pick-worker.component";
import {MyScheduleComponent} from "./schedule/component/my-schedule/my-schedule.component";
import {PickRoomComponent} from "./schedule/component/room/pick-room/pick-room.component";
import {RoomScheduleComponent} from "./schedule/component/room/room-schedule/room-schedule.component";
import {PickItemComponent} from "./schedule/component/item/pick-item/pick-item.component";
import {ItemScheduleComponent} from "./schedule/component/item/item-schedule/item-schedule.component";
import {VisitHistoryComponent} from "./component/visit/visit-history/visit-history.component";
import {MakeAppointmentComponent} from "./component/visit/make-appointment/make-appointment.component";
import {PlanYourVisitComponent} from "./component/visit/plan-your-visit/plan-your-visit.component";
import {VisitDetailsComponent} from "./component/visit/visit-details/visit-details.component";
import {LoginAgainComponent} from "./component/access-denied/login-again/login-again.component";

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'login/reset-password-email', component: PasswordResetEmailInputComponent },
  { path: 'login/password-reset/:resetToken', component: PasswordResetComponent },
  { path: 'access-denied', component: AccessDeniedComponent },
  { path: 'login-again', component: LoginAgainComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: roleNames[UserRole.ROLE_CLIENT]
    }
  },
  {
    path: 'profile/change-password',
    component: ChangePasswordComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: roleNames[UserRole.ROLE_CLIENT]
    }
  },

  {
    path: 'profile/edit-profile',
    component: EditProfileComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: roleNames[UserRole.ROLE_CLIENT]
    }
  },
  {
    path: 'profile/edit-profile/:id',
    component: EditProfileComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: roleNames[UserRole.ROLE_ADMIN]
    }
  },
  {
    path: 'profile/edit-email',
    component: EditEmailComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: roleNames[UserRole.ROLE_CLIENT]
    }
  },
  {
    path: 'profile/edit-email/:id',
    component: EditEmailComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: roleNames[UserRole.ROLE_ADMIN]
    }
  },
  {
    path: 'new-email-activation/:token',
    component: ActivateNewEmailComponent,
  },
  {
    path: 'client/list',
    component: ClientListComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: roleNames[UserRole.ROLE_WORKER]
    }
  },
  {
    path: 'client/details',
    component: ClientDetailsComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: roleNames[UserRole.ROLE_WORKER]
    }
  },
  {
    path: 'client/new',
    component: AddClientComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: roleNames[UserRole.ROLE_RECEPTIONIST]
    }
  },
  {
    path: 'client/edit/:id',
    component: EditClientComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: roleNames[UserRole.ROLE_RECEPTIONIST]
    }
  },
  {
    path: 'users',
    component: UserListComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: roleNames[UserRole.ROLE_ADMIN]
    }
  },
  {
    path: 'specific-user/:id',
    component:SpecificUserComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: roleNames[UserRole.ROLE_RECEPTIONIST]
    }
  },
  {
    path: 'specific-user/edit-role/:id',
    component: EditRoleComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: roleNames[UserRole.ROLE_ADMIN]
    }
  },
  {
    path: 'services',
    component: ServiceListComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: roleNames[UserRole.ROLE_ADMIN]
    }
  },
  {
    path: 'service/:id',
    component: ServiceDetailsComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: roleNames[UserRole.ROLE_ADMIN]
    }
  },
  {
    path: 'specific-user/worker-services/:id',
    component: WorkerServicesComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: roleNames[UserRole.ROLE_ADMIN]
    }
  },
  {
    path: 'services/add-service',
    component: NewServiceComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: roleNames[UserRole.ROLE_ADMIN]
    }
  },
  {
    path: 'rooms',
    component: RoomListComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: roleNames[UserRole.ROLE_ADMIN]
    }
  },
  {
    path: 'rooms/add-room',
    component: NewRoomComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: roleNames[UserRole.ROLE_ADMIN]
    }
  },
  {
    path: 'room/:id',
    component: RoomDetailsComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: roleNames[UserRole.ROLE_ADMIN]
    }
  },
  {
    path: 'room/:id/edit-performed-services',
    component: EditPerformedServicesComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: roleNames[UserRole.ROLE_ADMIN]
    }
  },
  {
    path: 'equipment',
    component: EquipmentListComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: roleNames[UserRole.ROLE_ADMIN]
    }
  },
  {
    path: 'equipment/model/:id',
    component: ModelDetailsComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: roleNames[UserRole.ROLE_ADMIN]
    }
  },
  {
    path: 'equipment/add-model',
    component: NewModelComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: roleNames[UserRole.ROLE_ADMIN]
    }
  },
  {
    path: 'creator',
    component: CreatorComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: roleNames[UserRole.ROLE_ADMIN]
    }
  },
  {
    path: 'creator/add-model',
    component: NewModelCreatorComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: roleNames[UserRole.ROLE_ADMIN]
    }
  },
  {
    path: 'visit/make-appointment',
    component: MakeAppointmentComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: roleNames[UserRole.ROLE_CLIENT]
    }
  },
  {
    path: 'visit/plan-your-visit',
    component: PlanYourVisitComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: roleNames[UserRole.ROLE_WORKER]
    }
  },
  {
    path: 'visit-history',
    component: VisitHistoryComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: roleNames[UserRole.ROLE_CLIENT]
    }
  },
  {
    path: 'visit-details/:id',
    component: VisitDetailsComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: roleNames[UserRole.ROLE_CLIENT]
    }
  },
  {
    path: 'schedule/my',
    component: MyScheduleComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: roleNames[UserRole.ROLE_WORKER]
    }
  },
  {
    path: 'schedule/worker/:id',
    component: WorkerScheduleComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: roleNames[UserRole.ROLE_WORKER]
    }
  },
  {
    path: 'schedule/workers/pick-worker',
    component: PickWorkerComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: roleNames[UserRole.ROLE_RECEPTIONIST]
    }
  },
  {
    path: 'schedule/room/pick-room',
    component: PickRoomComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: roleNames[UserRole.ROLE_WORKER]
    }
  },
  {
    path: 'schedule/room/:id',
    component: RoomScheduleComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: roleNames[UserRole.ROLE_WORKER]
    }
  },
  {
    path: 'schedule/item/pick-item',
    component: PickItemComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: roleNames[UserRole.ROLE_WORKER]
    }
  },
  {
    path: 'schedule/item/:id',
    component: ItemScheduleComponent,
    canActivate: [RoleGuard],
    data: {
      expectedRole: roleNames[UserRole.ROLE_WORKER]
    }
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];

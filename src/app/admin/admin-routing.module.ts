import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HotelInfoComponent } from './hotel-info/hotel-info.component';
import { RoomManagementComponent } from './room-management/room-management.component';
import { ReservationsComponent } from './reservations/reservations.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { ReviewsComponent } from './reviews/reviews.component';
import { ReportsComponent } from './reports/reports.component';
import { UsersComponent } from './users/users.component';
import { UserEditComponent } from './users/user-edit/user-edit.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'hotel-info',
    component: HotelInfoComponent
  },
  {
    path: 'room-management',
    component: RoomManagementComponent
  },
  {
    path: 'reservations',
    component: ReservationsComponent
  },
  {
    path: 'notifications',
    component: NotificationsComponent
  },
  {
    path: 'reviews',
    component: ReviewsComponent
  },
  {
    path: 'reports',
    component: ReportsComponent
  },
  {
    path: 'users',
    component: UsersComponent
  },
  {
    path: 'users/new',
    component: UserEditComponent
  },
  {
    path: 'users/edit/:id',
    component: UserEditComponent
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }

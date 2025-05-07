import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing.module';
import { HotelInfoComponent } from './hotel-info/hotel-info.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RoomManagementComponent } from './room-management/room-management.component';
import { ReservationsComponent } from './reservations/reservations.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { ReviewsComponent } from './reviews/reviews.component';
import { ReportsComponent } from './reports/reports.component';

@NgModule({
  declarations: [
    HotelInfoComponent,
    DashboardComponent,
    RoomManagementComponent,
    ReservationsComponent,
    NotificationsComponent,
    ReviewsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AdminRoutingModule,
    ReportsComponent
  ]
})
export class AdminModule { }

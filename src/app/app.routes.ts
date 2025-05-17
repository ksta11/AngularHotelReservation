import { Routes } from '@angular/router';
import { HotelInfoComponent } from './admin/hotel-info/hotel-info.component';
import { RoomManagementComponent } from './admin/room-management/room-management.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { ReservationsComponent } from './admin/reservations/reservations.component';
import { NotificationsComponent } from './admin/notifications/notifications.component';
import { ReviewsComponent } from './admin/reviews/reviews.component';
import { ReportsComponent } from './admin/reports/reports.component';
import { UsersComponent } from './admin/users/users.component';
import { UserEditComponent } from './admin/users/user-edit/user-edit.component';

export const routes: Routes = [
  {
    path: 'admin',
    children: [
      {
        path: 'hotel-info',
        component: HotelInfoComponent
      },
      {
        path: 'room-management',
        component: RoomManagementComponent
      },
      {
        path: 'dashboard',
        component: DashboardComponent
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
      }
    ]
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: '',
    redirectTo: 'admin/dashboard',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'admin/dashboard'
  }
];

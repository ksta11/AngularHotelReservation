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
import { NewReservationComponent } from './admin/reservations/new-reservation/new-reservation.component';
import { AuthGuard } from './auth/guards/auth.guard';
import { RoleGuard } from './auth/guards/role.guard';
import { AccessDeniedComponent } from './shared/access-denied/access-denied.component';
import { MainLayoutComponent } from './shared/layouts/main-layout/main-layout.component';

import { AdminLayoutComponent } from './admin/shared/layout/admin-layout.component';

export const routes: Routes = [
  // Rutas principales dentro del MainLayoutComponent
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'access-denied',
        component: AccessDeniedComponent
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'auth/login'
      }
    ]
  },
  
  // Ruta de admin con su propio layout
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'hotel-info',
        component: HotelInfoComponent,
        canActivate: [RoleGuard],
        data: { roles: ['hotel_admin', 'admin'] }
      },
      {
        path: 'room-management',
        component: RoomManagementComponent,
        canActivate: [RoleGuard],
        data: { roles: ['hotel_admin', 'admin'] }
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [RoleGuard],
        data: { roles: ['hotel_admin', 'admin'] }
      },
      {
        path: 'reservations',
        canActivate: [RoleGuard],
        data: { roles: ['hotel_admin', 'admin'] },
        children: [
          {
            path: '',
            component: ReservationsComponent
          },
          {
            path: 'new',
            component: NewReservationComponent
          }
        ]
      },      {
        path: 'notifications',
        component: NotificationsComponent,
        canActivate: [RoleGuard],
        data: { roles: ['admin'] }
      },
      {
        path: 'reviews',
        component: ReviewsComponent,
        canActivate: [RoleGuard],
        data: { roles: ['hotel_admin', 'admin'] }
      },
      {
        path: 'reports',
        component: ReportsComponent,
        canActivate: [RoleGuard],
        data: { roles: ['hotel_admin', 'admin'] }
      },
      {
        path: 'users',
        component: UsersComponent,
        canActivate: [RoleGuard],
        data: { roles: ['admin'] }
      },
      {
        path: 'users/new',
        component: UserEditComponent,
        canActivate: [RoleGuard],
        data: { roles: ['admin'] }
      },
      {
        path: 'users/edit/:id',
        component: UserEditComponent,
        canActivate: [RoleGuard],
        data: { roles: ['admin'] }
      }
    ]
  },  // Ruta de client dentro del MainLayoutComponent
  {
    path: 'client',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./client/client.module').then(m => m.ClientModule),
        canActivate: [AuthGuard],
        data: { roles: ['client'] }
      }
    ]
  },

  // Ruta de auth dentro del MainLayoutComponent (login y registro)
  {
    path: 'auth',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
      }
    ]
  },

  // Redirecciones y ruta por defecto
  {
    path: '**',
    redirectTo: 'auth/login'
  }
];

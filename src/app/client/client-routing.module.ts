import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AvailableRoomsComponent } from './available-rooms/available-rooms.component';
import { CreateHotelComponent } from './create-hotel/create-hotel.component';
import { RoleGuard } from '../auth/guards/role.guard';
import { MyReservationsComponent } from './my-reservations/my-reservations.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  {
    path: 'available-rooms',
    component: AvailableRoomsComponent,
    canActivate: [RoleGuard],
    data: { roles: ['client'] }
  },
  {
    path: 'bookings',
    component: MyReservationsComponent,
    canActivate: [RoleGuard],
    data: { roles: ['client'] }
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [RoleGuard],
    data: { roles: ['client'] }
  },
  {
    path: 'dashboard',
    component: AvailableRoomsComponent, // Temporalmente usando este componente, debería reemplazarse por el real
    canActivate: [RoleGuard],
    data: { roles: ['client'] }
  },
  {
    path: 'create-hotel',
    component: CreateHotelComponent,
    canActivate: [RoleGuard],
    data: { roles: ['client'] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { } 
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AvailableRoomsComponent } from './available-rooms/available-rooms.component';

const routes: Routes = [
  {
    path: 'available-rooms',
    component: AvailableRoomsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { } 
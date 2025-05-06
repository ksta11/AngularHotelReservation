import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HotelInfoComponent } from './hotel-info/hotel-info.component';

const routes: Routes = [
  {
    path: 'hotel-info',
    component: HotelInfoComponent
  },
  {
    path: '',
    redirectTo: 'hotel-info',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }

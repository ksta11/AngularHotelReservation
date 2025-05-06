import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HotelInfoComponent } from './admin/hotel-info/hotel-info.component';

const routes: Routes = [
  {
    path: 'admin/hotel-info',
    component: HotelInfoComponent
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: '',
    redirectTo: 'admin/hotel-info',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'auth/login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { } 
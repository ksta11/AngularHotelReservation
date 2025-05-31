import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { DashboardStats } from '../models/dashboard.model';
import { HotelService } from './hotel.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = `${environment.apiUrl}/hotels`;

  constructor(private http: HttpClient, private hotelService: HotelService) {}

  /**
   * Obtiene las estadísticas para el dashboard de un hotel específico
   * @returns Observable con las estadísticas del dashboard
   */
  getDashboardStats(): Observable<DashboardStats> {
    const hotelId = this.hotelService.getHotelIdFromStorage();
    return this.http.get<DashboardStats>(`${this.apiUrl}/${hotelId}/statistics`);
  }
}

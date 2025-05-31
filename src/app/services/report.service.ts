import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { tap, catchError } from 'rxjs/operators';

export interface ReportGeneralData {
  startDate: string;
  endDate: string;
  roomType: string | null;
}

export interface BaseReport {
  id: string;
  hotelId: string;
  type: string;
  pdfUrl: string;
  createdAt: string;
  generalData: ReportGeneralData;
}

export interface OccupancyReport extends BaseReport {
  totalRooms: number;
  occupiedRooms: number;
  occupancyRate: number;
  averageStay: number;
}

export interface RevenueReport extends BaseReport {
  totalRevenue: number;
  averageRevenue: number;
}

export interface ReservationReport extends BaseReport {
  totalReservations: number;
  confirmedReservations: number;
  cancelledReservations: number;
  completedReservations: number;
}

export type Report = OccupancyReport | RevenueReport | ReservationReport;

export interface CreateReportRequest {
  startDate: string;
  endDate: string;
}

@Injectable({
  providedIn: 'root'
})

export class ReportService {
  private baseApiUrl = `${environment.apiUrl}`;
  private reportUrl = `${this.baseApiUrl}/report`;

  constructor(private http: HttpClient) { }
  getReportsForHotel(hotelId: string): Observable<Report[]> {
    return this.http.get<Report[]>(`${this.reportUrl}/hotel/${hotelId}`)
      .pipe(
        tap(reports => console.log('Reportes recibidos:', reports)),
        catchError(this.handleError)
      );
  }
  
  createOccupancyReport(hotelId: string, data: CreateReportRequest): Observable<OccupancyReport> {
    // Enviar el ID del hotel en la URL siguiendo el mismo patrón que getReportsForHotel
    return this.http.post<OccupancyReport>(`${this.reportUrl}/occupancy/hotel/${hotelId}`, data)
      .pipe(
        tap(report => console.log('Reporte de ocupación creado:', report)),
        catchError(this.handleError)
      );
  }
  
  createRevenueReport(hotelId: string, data: CreateReportRequest): Observable<RevenueReport> {
    // Enviar el ID del hotel en la URL siguiendo el mismo patrón que getReportsForHotel
    return this.http.post<RevenueReport>(`${this.reportUrl}/revenue/hotel/${hotelId}`, data)
      .pipe(
        tap(report => console.log('Reporte de ingresos creado:', report)),
        catchError(this.handleError)
      );
  }
  
  createReservationReport(hotelId: string, data: CreateReportRequest): Observable<ReservationReport> {
    // Enviar el ID del hotel en la URL siguiendo el mismo patrón que getReportsForHotel
    return this.http.post<ReservationReport>(`${this.reportUrl}/reservation/hotel/${hotelId}`, data)
      .pipe(
        tap(report => console.log('Reporte de reservaciones creado:', report)),
        catchError(this.handleError)
      );
  }
  private handleError(error: any): Observable<never> {
    console.error('Error en el servicio de reportes:', error);
    
    let errorMessage = 'Error al obtener los reportes. Por favor, intente nuevamente.';
    
    // Check if there's a specific error message from the backend
    if (error.error && error.error.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return new Observable(observer => {
      observer.error(errorMessage);
    });
  }
}

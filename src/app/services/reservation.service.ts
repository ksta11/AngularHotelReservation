import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Reservation } from '../models/reservation.model';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private baseApiUrl = `${environment.apiUrl}`;
  private reservationsUrl = `${this.baseApiUrl}/reservations`;

  constructor(private http: HttpClient) { }
  // Obtener todas las reservas de un hotel
  getReservations(hotelId: string, params?: any): Observable<Reservation[]> {
    let httpParams = new HttpParams();
    if (params) {
      if (params.status) httpParams = httpParams.append('status', params.status);
      if (params.dateFilter) httpParams = httpParams.append('dateFilter', params.dateFilter);
      if (params.search) httpParams = httpParams.append('search', params.search);
    }

    return this.http.get<Reservation[]>(`${this.reservationsUrl}/hotel/${hotelId}`, { params: httpParams })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Obtener una reserva por ID
  getReservation(hotelId: string, reservationId: string): Observable<Reservation> {
    return this.http.get<Reservation>(`${this.reservationsUrl}/${reservationId}`)
      .pipe(
        catchError(this.handleError)
      );
  }  // Crear una nueva reserva
  createReservation(hotelId: string, reservation: Partial<Reservation>): Observable<Reservation> {
    // Aseguramos que la reserva incluya el hotelId y eliminamos los campos no necesarios
    const { guestName, roomType, phone, ...reservationData } = reservation;
    const reservationToSend = { ...reservationData, hotelId };
    return this.http.post<Reservation>(`${this.reservationsUrl}/hotel/${hotelId}`, reservationToSend)
      .pipe(
        catchError(this.handleError)
      );
  }
  // Actualizar una reserva existente
  updateReservation(hotelId: string, reservationId: string, reservation: Partial<Reservation>): Observable<Reservation> {
    // Aseguramos que la reserva incluya el hotelId
    const reservationWithHotelId = { ...reservation, hotelId };
    return this.http.put<Reservation>(`${this.reservationsUrl}/${reservationId}`, reservationWithHotelId)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Eliminar una reserva
  deleteReservation(hotelId: string, reservationId: string): Observable<any> {
    return this.http.delete<any>(`${this.reservationsUrl}/${reservationId}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Cambiar el estado de una reserva
  changeReservationStatus(hotelId: string, reservationId: string, status: string): Observable<Reservation> {
    return this.http.patch<Reservation>(`${this.reservationsUrl}/${reservationId}/status`, { status })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Cambiar el estado del pago
  changePaymentStatus(hotelId: string, reservationId: string, paymentStatus: string): Observable<Reservation> {
    return this.http.patch<Reservation>(`${this.reservationsUrl}/${reservationId}/payment`, { paymentStatus })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Manejo de errores
  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error devuelto por el backend
      errorMessage = `Código de error: ${error.status}, mensaje: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => errorMessage);
  }
}

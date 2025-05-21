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

  constructor(private http: HttpClient) { }  // Obtener todas las reservas de un hotel
  getReservations(hotelId: string, params?: any): Observable<Reservation[]> {
    let httpParams = new HttpParams();
    if (params) {
      if (params.status) httpParams = httpParams.append('status', params.status);
      if (params.dateFilter) httpParams = httpParams.append('dateFilter', params.dateFilter);
      if (params.search) httpParams = httpParams.append('search', params.search);
    }

    const url = `${this.reservationsUrl}/hotel/${hotelId}`;
    console.log(`Llamando a la API: ${url} con parámetros:`, httpParams.toString());

    return this.http.get<Reservation[]>(url, { params: httpParams })
      .pipe(
        tap(response => {
          console.log(`API respuesta para ${url}:`, response);
          if (Array.isArray(response)) {
            console.log(`Recibidas ${response.length} reservaciones`);
          } else {
            console.warn('La respuesta de la API no es un array', response);
          }
        }),
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
    // Aseguramos que la reserva incluya el hotelId
    // Ya no es necesario eliminar campos como guestName y roomType ya que la API ahora usa objetos anidados
    const reservationToSend = { ...reservation, hotelId };
    
    console.log('Enviando reserva a la API:', reservationToSend);
    
    return this.http.post<Reservation>(`${this.reservationsUrl}/hotel/${hotelId}`, reservationToSend)
      .pipe(
        tap(response => console.log('Respuesta de creación de reserva:', response)),
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
  updateReservationStatus(hotelId: string, reservationId: string, status: string): Observable<Reservation> {
    return this.http.put<Reservation>(`${this.reservationsUrl}/${reservationId}/status`, { status })
      .pipe(
        tap(response => console.log(`Estado de reserva actualizado a ${status}:`, response)),
        catchError(this.handleError)
      );
  }

  // Marcar una reserva como pagada
  markReservationAsPaid(hotelId: string, reservationId: string): Observable<Reservation> {
    return this.http.put<Reservation>(`${this.reservationsUrl}/${reservationId}/pay`, {})
      .pipe(
        tap(response => console.log('Reserva marcada como pagada:', response)),
        catchError(this.handleError)
      );
  }
  // Manejo de errores
  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error del cliente: ${error.error.message}`;
    } else {
      // Error devuelto por el backend
      errorMessage = `Error del servidor: código ${error.status}, mensaje: ${error.message}`;
      
      // Añadir más información de depuración
      console.error('Detalles completos del error HTTP:', {
        status: error.status,
        statusText: error.statusText,
        url: error.url,
        message: error.message,
        error: error.error
      });
      
      // Si hay un mensaje de error específico del backend, mostrarlo
      if (error.error && typeof error.error === 'object') {
        if (error.error.message) {
          errorMessage += ` - ${error.error.message}`;
        }
      }
    }
    console.error('Error en la petición HTTP:', errorMessage);
    return throwError(() => errorMessage);
  }
}

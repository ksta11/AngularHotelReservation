import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Room } from '../models/room.model';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private baseApiUrl = `${environment.apiUrl}/hotels`;

  constructor(private http: HttpClient) { }

  // Obtener todas las habitaciones de un hotel
  getRooms(hotelId: string): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.baseApiUrl}/${hotelId}/rooms`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Obtener una habitación por ID
  getRoom(hotelId: string, roomId: string): Observable<Room> {
    return this.http.get<Room>(`${this.baseApiUrl}/${hotelId}/rooms/${roomId}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Crear una nueva habitación
  createRoom(hotelId: string, room: Partial<Room>): Observable<Room> {
    return this.http.post<Room>(`${this.baseApiUrl}/${hotelId}/rooms`, room)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Actualizar una habitación existente
  updateRoom(hotelId: string, roomId: string, room: Partial<Room>): Observable<Room> {
    return this.http.put<Room>(`${this.baseApiUrl}/${hotelId}/rooms/${roomId}`, room)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Eliminar una habitación
  deleteRoom(hotelId: string, roomId: string): Observable<any> {
    return this.http.delete<any>(`${this.baseApiUrl}/${hotelId}/rooms/${roomId}`)
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

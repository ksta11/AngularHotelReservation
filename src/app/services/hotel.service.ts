import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Hotel } from '../models/hotel.model';
import { AuthService } from '../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class HotelService {
  private apiUrl = `${environment.apiUrl}/hotels`;
  private readonly HOTEL_ID_KEY = 'hotelId';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  // Guardar ID del hotel en localStorage
  saveHotelId(hotelId: string): void {
    localStorage.setItem(this.HOTEL_ID_KEY, hotelId);
  }

  // Obtener ID del hotel desde localStorage
  getHotelIdFromStorage(): string | null {
    return localStorage.getItem(this.HOTEL_ID_KEY);
  }

  // Eliminar ID del hotel del localStorage
  clearHotelId(): void {
    localStorage.removeItem(this.HOTEL_ID_KEY);
  }

  // Obtener todos los hoteles
  getHotels(): Observable<Hotel[]> {
    return this.http.get<Hotel[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError)
      );
  }  // Obtener un hotel por ID
  getHotelById(id: string): Observable<Hotel> {
    return this.http.get<Hotel>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }
  // Obtener hotel por userId
  getHotelByUserId(userId: string): Observable<Hotel> {
    return this.http.get<Hotel>(`${this.apiUrl}/by-user/${userId}`)
      .pipe(
        tap((hotel: Hotel) => {
          if (hotel && hotel.id) {
            this.saveHotelId(hotel.id);
          }
        }),
        catchError(this.handleError)
      );
  }
  // Crear un nuevo hotel
  createHotel(hotel: Partial<Hotel>): Observable<Hotel> {
    return this.http.post<Hotel>(this.apiUrl, hotel)
      .pipe(
        tap((newHotel: Hotel) => {
          if (newHotel && newHotel.id) {
            this.saveHotelId(newHotel.id);
          }
        }),
        catchError(this.handleError)
      );
  }
  // Actualizar un hotel existente
  updateHotel(id: string, hotel: Partial<Hotel>): Observable<Hotel> {
    return this.http.put<Hotel>(`${this.apiUrl}/${id}`, hotel)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Eliminar un hotel
  deleteHotel(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Verificar si ya hay un hotel asociado (útil para determinar comportamientos en la UI)
  hasHotel(): boolean {
    return !!this.getHotelIdFromStorage();
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
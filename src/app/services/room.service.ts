import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, map } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Room, RoomType, RoomStatus } from '../models/room.model';

interface HotelResponse {
  id: string;
  name: string;
}

interface RoomResponse {
  id: string;
  roomNumber: string;
  roomType: string;
  price: number;
  capacity: number;
  state: string;
  description: string | null;
  amenities: string[];
  imageUrl: string | null;
  hotel: HotelResponse;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Obtener todas las habitaciones de un hotel
  getRooms(hotelId: string): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.apiUrl}/hotels/${hotelId}/rooms`)
      .pipe(
        map(this.mapRoomsResponse)
      );
  }

  // Obtener habitaciones disponibles
  getAvailableRooms(): Observable<Room[]> {
    return this.http.get<RoomResponse[]>(`${this.apiUrl}/hotels/rooms/available`)
      .pipe(
        map(this.mapRoomsResponse)
      );
  }

  // Crear una nueva habitación
  createRoom(hotelId: string, roomData: Partial<Room>): Observable<Room> {
    return this.http.post<Room>(`${this.apiUrl}/hotels/${hotelId}/rooms`, roomData);
  }

  // Actualizar una habitación existente
  updateRoom(hotelId: string, roomId: string, roomData: Partial<Room>): Observable<Room> {
    return this.http.put<Room>(`${this.apiUrl}/hotels/${hotelId}/rooms/${roomId}`, roomData);
  }

  // Eliminar una habitación
  deleteRoom(hotelId: string, roomId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/hotels/${hotelId}/rooms/${roomId}`);
  }

  // Obtener una habitación específica
  getRoom(hotelId: string, roomId: string): Observable<Room> {
    return this.http.get<Room>(`${this.apiUrl}/hotels/${hotelId}/rooms/${roomId}`);
  }

  // Método auxiliar para mapear la respuesta de habitaciones
  private mapRoomsResponse(rooms: any[]): Room[] {
    return rooms.map(room => ({
      id: room.id,
      roomNumber: room.roomNumber,
      roomType: room.roomType as RoomType,
      description: room.description,
      capacity: room.capacity,
      price: room.price,
      amenities: Array.isArray(room.amenities) ? room.amenities : room.amenities?.split(',').map((a: string) => a.trim()) || [],
      state: (room.state || 'AVAILABLE').toUpperCase() as RoomStatus,
      imageUrl: room.imageUrl || null,
      hotel: room.hotel,
      createdAt: room.createdAt,
      updatedAt: room.updatedAt
    }));
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

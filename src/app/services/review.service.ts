import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Review, ReviewResponse } from '../models/review.model';
import { HotelService } from './hotel.service';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = `${environment.apiUrl}/reviews`;

  constructor(
    private http: HttpClient,
    private hotelService: HotelService
  ) { }

  /**
   * Obtiene todas las reseñas de un hotel específico
   * @throws Error cuando no se encuentra el ID del hotel
   */
  getHotelReviews(): Observable<Review[]> {
    const hotelId = this.hotelService.getHotelIdFromStorage();
    if (!hotelId) {
      return throwError(() => new Error('No se encontró el ID del hotel'));
    }
    return this.http.get<Review[]>(`${this.apiUrl}/hotel/${hotelId}`);
  }

  /**
   * Responde a una reseña específica
   * @param reviewId ID de la reseña
   * @param response Respuesta del hotel
   * @throws Error cuando no se encuentra el ID del hotel
   */
  respondToReview(reviewId: string, response: string): Observable<Review> {
    const hotelOwnerId = this.hotelService.getHotelIdFromStorage();
    if (!hotelOwnerId) {
      return throwError(() => new Error('No se encontró el ID del hotel'));
    }
    
    const body: ReviewResponse = {
      response,
      hotelOwnerId
    };
    return this.http.post<Review>(`${this.apiUrl}/${reviewId}/response`, body);
  }
}
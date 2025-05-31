export interface Review {
  id: string;
  hotelId: string;
  userId: string;
  reservationId: string;
  rating: number;
  comment: string;
  hotelResponse: string | null;
  responseDate: string | null;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewResponse {
  response: string;
  hotelOwnerId: string;
}
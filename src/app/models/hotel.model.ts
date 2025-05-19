export interface Hotel {
  id?: string;            // Cambiado de number a string según estructura de respuesta
  name: string;
  description: string;
  // Campos planos para facilitar la integración con la API
  address: string;
  city: string;
  country: string;
  postalCode: string;
  phone: string;
  email: string;
  website?: string;
  checkInTime: string;
  checkOutTime: string;
  cancellationPolicy: string;
  averageRating?: number;  // Cambiado de 'rating' a 'averageRating' según estructura de respuesta
  rooms?: any[];           // Añadido según estructura de respuesta
  amenities?: string[];
  images?: string[];
  userId?: string;         // ID del usuario propietario
  createdAt?: string;      // Cambiado de Date a string para manejar el formato ISO
  updatedAt?: string;      // Cambiado de Date a string para manejar el formato ISO
}
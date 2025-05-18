export interface Hotel {
  id?: number;
  name: string;
  description: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  contactInfo: {
    phone: string;
    email: string;
    website?: string;
  };
  policies: {
    checkInTime: string;
    checkOutTime: string;
    cancellationPolicy: string;
    petPolicy: string;
    smokingPolicy: string;
  };
  amenities: string[];
  images: string[];
  rating?: number;
  userId?: string;         // ID del usuario propietario
  createdAt?: Date;
  updatedAt?: Date;
}
export interface User {
    id: string;
    name: string;
    email: string;
}

export interface Room {
    id: string;
    number: string;
    type: string;
    price: number;
}

export interface Reservation {
    id?: string;
    userId?: string;
    hotelId: string;
    roomId?: string;
    // Campos para compatibilidad con código anterior
    roomNumber?: string;
    roomType?: string;
    guestName?: string;
    email?: string;
    userEmail?: string;
    phone?: string;
    checkIn?: string;
    checkOut?: string;
    
    // Campos actualizados según la nueva respuesta de API
    checkInDate?: string;
    checkOutDate?: string;
    adults?: number;
    children?: number;
    status: ReservationStatus | string;
    paymentStatus: PaymentStatus | string;
    totalAmount?: number;
    totalPrice?: number;
    specialRequests?: string;
    createdAt?: string;
    updatedAt?: string;
    
    // Objetos anidados de la nueva respuesta
    user?: User;
    room?: Room;
}

export enum ReservationStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    CHECKED_IN = 'checked-in',
    CHECKED_OUT = 'checked-out',
    CANCELLED = 'cancelled'
}

export enum PaymentStatus {
    PENDING = 'pending',
    PAID = 'paid',
    REFUNDED = 'refunded'
}

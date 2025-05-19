export interface Reservation {
    id?: string;
    hotelId: string;
    roomId: string;
    roomNumber?: string;
    roomType?: string;
    guestName?: string;
    email: string;
    phone?: string; // Opcional ahora
    checkIn: string;
    checkOut: string;
    adults?: number;
    children?: number;
    status: ReservationStatus | string;
    paymentStatus: PaymentStatus | string;
    totalAmount: number;
    specialRequests?: string;
    createdAt?: string;
    updatedAt?: string;
}

export enum ReservationStatus {
    PENDING = 'pendiente',
    CONFIRMED = 'confirmada',
    CANCELED = 'cancelada',
    COMPLETED = 'completada'
}

export enum PaymentStatus {
    PENDING = 'pendiente',
    PARTIAL = 'parcial',
    PAID = 'pagado',
    REFUNDED = 'reembolsado'
}

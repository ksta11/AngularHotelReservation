export interface Room {
    id?: string;
    roomNumber: string;
    roomType: RoomType | string;
    description: string | null;
    capacity: number;
    price: number;
    amenities: string | string[];
    specialPrice?: number;
    specialPriceStartDate?: string;
    specialPriceEndDate?: string;
    state: RoomStatus | string;
    createdAt?: string;
    updatedAt?: string;
    hotel?: {
        id: string;
        name: string;
        address: string;
        category: number;
    };
    images?: string[];
}

export enum RoomType {
    SINGLE = 'SINGLE',
    DOUBLE = 'DOUBLE',
    TRIPLE = 'TRIPLE',
    QUAD = 'QUAD',
    SUITE = 'SUITE',
    DELUXE = 'DELUXE'
}

export enum RoomStatus {
    AVAILABLE = 'available',
    OCCUPIED = 'occupied',
    MAINTENANCE = 'maintenance',
    RESERVED = 'reserved'
}
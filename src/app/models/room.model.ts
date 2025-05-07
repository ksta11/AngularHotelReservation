export interface Room {
    id?: number;
    number: string;
    type: RoomType;
    capacity: number;
    price: number;
    description: string;
    amenities: string[];
    status: RoomStatus;
    images: string[];
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
    AVAILABLE = 'AVAILABLE',
    OCCUPIED = 'OCCUPIED',
    MAINTENANCE = 'MAINTENANCE',
    RESERVED = 'RESERVED'
} 
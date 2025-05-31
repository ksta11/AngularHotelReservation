export interface Room {
    id: string;
    roomNumber: string;
    roomType: RoomType | string;
    description: string | null;
    capacity: number;
    price: number;
    amenities: string[];
    state: RoomStatus | string;
    imageUrl: string | null;
    hotel: {
        id: string;
        name: string;
    };
    createdAt: string;
    updatedAt: string;
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
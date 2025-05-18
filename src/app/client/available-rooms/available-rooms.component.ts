import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface Room {
  id: number;
  number: string;
  type: string;
  price: number;
  capacity: number;
  amenities: string[];
  images: string[];
  available: boolean;
}

@Component({
  selector: 'app-available-rooms',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './available-rooms.component.html',
  styleUrls: ['./available-rooms.component.scss']
})
export class AvailableRoomsComponent implements OnInit {
  rooms: Room[] = [
    {
      id: 1,
      number: '101',
      type: 'Suite',
      price: 150,
      capacity: 2,
      amenities: ['WiFi', 'TV', 'Minibar', 'Vista al mar'],
      images: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&auto=format&fit=crop&q=60'],
      available: true
    },
    {
      id: 2,
      number: '102',
      type: 'Deluxe',
      price: 120,
      capacity: 2,
      amenities: ['WiFi', 'TV', 'Minibar'],
      images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop&q=60'],
      available: true
    },
    {
      id: 3,
      number: '103',
      type: 'Estándar',
      price: 80,
      capacity: 1,
      amenities: ['WiFi', 'TV'],
      images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&auto=format&fit=crop&q=60'],
      available: true
    }
  ];

  filteredRooms: Room[] = [];
  searchTerm: string = '';
  selectedType: string = 'todos';
  selectedPrice: string = 'todos';

  constructor() {}

  ngOnInit(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredRooms = this.rooms.filter(room => {
      const matchesSearch = this.searchTerm === '' || 
        room.number.includes(this.searchTerm) ||
        room.type.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesType = this.selectedType === 'todos' || 
        room.type.toLowerCase() === this.selectedType.toLowerCase();

      const matchesPrice = this.selectedPrice === 'todos' || 
        (this.selectedPrice === 'economico' && room.price < 100) ||
        (this.selectedPrice === 'medio' && room.price >= 100 && room.price < 150) ||
        (this.selectedPrice === 'premium' && room.price >= 150);

      return matchesSearch && matchesType && matchesPrice;
    });
  }

  onSearch(): void {
    this.applyFilters();
  }

  onTypeChange(): void {
    this.applyFilters();
  }

  onPriceChange(): void {
    this.applyFilters();
  }

  onReserve(roomId: number): void {
    // Aquí irá la lógica para reservar la habitación
    console.log('Reservando habitación:', roomId);
  }
} 
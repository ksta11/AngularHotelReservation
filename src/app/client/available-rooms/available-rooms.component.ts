import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Room, RoomType } from '../../models/room.model';
import { RoomService } from '../../services/room.service';

@Component({
  selector: 'app-available-rooms',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './available-rooms.component.html',
  styleUrls: ['./available-rooms.component.scss']
})
export class AvailableRoomsComponent implements OnInit {
  rooms: Room[] = [];
  filteredRooms: Room[] = [];
  searchTerm: string = '';
  selectedType: string = 'todos';
  selectedPrice: string = 'todos';
  isLoading: boolean = false;
  error: string | null = null;
  RoomType = RoomType;

  constructor(private roomService: RoomService) {}

  ngOnInit(): void {
    this.loadRooms();
  }

  loadRooms(): void {
    this.isLoading = true;
    this.error = null;

    this.roomService.getAvailableRooms().subscribe({
      next: (rooms) => {
        this.rooms = rooms;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar las habitaciones:', error);
        this.error = 'No se pudieron cargar las habitaciones. Por favor, inténtalo de nuevo.';
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    this.filteredRooms = this.rooms.filter(room => {
      const matchesSearch = !this.searchTerm || 
        room.roomNumber.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        this.getRoomTypeLabel(room.roomType).toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesType = this.selectedType === 'todos' || 
        room.roomType === this.selectedType;

      const matchesPrice = this.selectedPrice === 'todos' || 
        (this.selectedPrice === 'economico' && room.price < 100) ||
        (this.selectedPrice === 'medio' && room.price >= 100 && room.price <= 200) ||
        (this.selectedPrice === 'premium' && room.price > 200);

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

  onReserve(roomId: string): void {
    // Aquí irá la lógica para reservar la habitación
    console.log('Reservando habitación:', roomId);
  }

  getRoomTypeLabel(type: RoomType | string): string {
    switch (type) {
      case RoomType.SINGLE:
        return 'Individual';
      case RoomType.DOUBLE:
        return 'Doble';
      case RoomType.TRIPLE:
        return 'Triple';
      case RoomType.QUAD:
        return 'Cuádruple';
      case RoomType.SUITE:
        return 'Suite';
      case RoomType.DELUXE:
        return 'Deluxe';
      default:
        return type;
    }
  }
}
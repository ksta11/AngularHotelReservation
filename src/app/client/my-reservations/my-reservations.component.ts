import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSearch, faCalendarAlt, faHotel, faMoneyBillWave } from '@fortawesome/free-solid-svg-icons';

interface Reservation {
  id: string;
  hotelName: string;
  roomNumber: string;
  checkIn: Date;
  checkOut: Date;
  totalAmount: number;
  status: 'confirmada' | 'pendiente' | 'cancelada';
  paymentStatus: 'pagado' | 'pendiente' | 'parcial';
}

@Component({
  selector: 'app-my-reservations',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, FontAwesomeModule],
  templateUrl: './my-reservations.component.html',
  styleUrls: ['./my-reservations.component.scss']
})
export class MyReservationsComponent implements OnInit {
  // Iconos
  faSearch = faSearch;
  faCalendarAlt = faCalendarAlt;
  faHotel = faHotel;
  faMoneyBillWave = faMoneyBillWave;

  // Filtros
  searchTerm: string = '';
  statusFilter: string = 'todos';
  dateFilter: string = 'todos';

  // Datos y estado
  reservations: Reservation[] = [];
  filteredReservations: Reservation[] = [];
  loading: boolean = false;
  error: string | null = null;

  constructor() {}

  ngOnInit(): void {
    // Aquí cargaríamos las reservas del usuario desde el servicio
    this.loadMockData();
  }

  loadMockData(): void {
    // Datos de ejemplo
    this.reservations = [
      {
        id: '1',
        hotelName: 'Hotel Marina',
        roomNumber: '101',
        checkIn: new Date('2024-03-20'),
        checkOut: new Date('2024-03-25'),
        totalAmount: 750,
        status: 'confirmada',
        paymentStatus: 'pagado'
      },
      {
        id: '2',
        hotelName: 'Hotel City Center',
        roomNumber: '203',
        checkIn: new Date('2024-04-15'),
        checkOut: new Date('2024-04-20'),
        totalAmount: 600,
        status: 'pendiente',
        paymentStatus: 'parcial'
      }
    ];
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredReservations = this.reservations.filter(reservation => {
      const matchesSearch = this.searchTerm === '' || 
        reservation.hotelName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        reservation.roomNumber.includes(this.searchTerm);

      const matchesStatus = this.statusFilter === 'todos' || 
        reservation.status === this.statusFilter;

      const today = new Date();
      const checkIn = new Date(reservation.checkIn);
      const checkOut = new Date(reservation.checkOut);

      let matchesDate = true;
      if (this.dateFilter === 'hoy') {
        matchesDate = checkIn.toDateString() === today.toDateString();
      } else if (this.dateFilter === 'proximas') {
        matchesDate = checkIn > today;
      } else if (this.dateFilter === 'pasadas') {
        matchesDate = checkOut < today;
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'confirmada':
        return 'status-confirmed';
      case 'pendiente':
        return 'status-pending';
      case 'cancelada':
        return 'status-cancelled';
      default:
        return '';
    }
  }

  getPaymentStatusClass(status: string): string {
    switch (status) {
      case 'pagado':
        return 'payment-paid';
      case 'pendiente':
        return 'payment-pending';
      case 'parcial':
        return 'payment-partial';
      default:
        return '';
    }
  }

  onSearch(): void {
    this.applyFilters();
  }

  onStatusFilterChange(): void {
    this.applyFilters();
  }

  onDateFilterChange(): void {
    this.applyFilters();
  }

  onCancelReservation(id: string): void {
    if (confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
      // Aquí iría la lógica para cancelar la reserva
      console.log('Cancelando reserva:', id);
    }
  }
} 
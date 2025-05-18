import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSearch, faPlus, faEdit, faTrash, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

interface Reservation {
  id: number;
  guestName: string;
  email: string;
  phone: string;
  roomNumber: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  status: 'Confirmada' | 'Pendiente' | 'Cancelada';
  totalAmount: number;
  paymentStatus: 'Pagado' | 'Pendiente' | 'Parcial';
  specialRequests?: string;
}

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, FontAwesomeModule],
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.scss']
})
export class ReservationsComponent implements OnInit {
  // Iconos
  faSearch = faSearch;
  faPlus = faPlus;
  faEdit = faEdit;
  faTrash = faTrash;
  faCheck = faCheck;
  faTimes = faTimes;

  // Filtros
  searchTerm: string = '';
  statusFilter: string = 'todos';
  dateFilter: string = 'todos';

  // Datos de ejemplo
  reservations: Reservation[] = [
    {
      id: 1,
      guestName: 'Juan Pérez',
      email: 'juan@email.com',
      phone: '123-456-7890',
      roomNumber: '101',
      roomType: 'Suite',
      checkIn: '2024-03-20',
      checkOut: '2024-03-25',
      status: 'Confirmada',
      totalAmount: 1500,
      paymentStatus: 'Pagado',
      specialRequests: 'Cama king size'
    },
    {
      id: 2,
      guestName: 'María García',
      email: 'maria@email.com',
      phone: '987-654-3210',
      roomNumber: '203',
      roomType: 'Doble',
      checkIn: '2024-03-21',
      checkOut: '2024-03-23',
      status: 'Pendiente',
      totalAmount: 600,
      paymentStatus: 'Pendiente'
    },
    {
      id: 3,
      guestName: 'Carlos López',
      email: 'carlos@email.com',
      phone: '555-123-4567',
      roomNumber: '305',
      roomType: 'Individual',
      checkIn: '2024-03-22',
      checkOut: '2024-03-24',
      status: 'Confirmada',
      totalAmount: 400,
      paymentStatus: 'Parcial'
    }
  ];

  filteredReservations: Reservation[] = [];

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredReservations = this.reservations.filter(reservation => {
      const matchesSearch = this.searchTerm === '' || 
        reservation.guestName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        reservation.roomNumber.includes(this.searchTerm) ||
        reservation.email.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesStatus = this.statusFilter === 'todos' || 
        reservation.status.toLowerCase() === this.statusFilter.toLowerCase();

      const today = new Date();
      const checkIn = new Date(reservation.checkIn);
      const checkOut = new Date(reservation.checkOut);

      let matchesDate = true;
      if (this.dateFilter === 'hoy') {
        matchesDate = checkIn.toDateString() === today.toDateString();
      } else if (this.dateFilter === 'semana') {
        const weekFromNow = new Date(today);
        weekFromNow.setDate(today.getDate() + 7);
        matchesDate = checkIn >= today && checkIn <= weekFromNow;
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
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
    switch (status.toLowerCase()) {
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

  onDeleteReservation(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta reserva?')) {
      this.reservations = this.reservations.filter(r => r.id !== id);
      this.applyFilters();
    }
  }

  onNewReservation(): void {
    this.router.navigate(['/admin/reservations/new']);
  }
}

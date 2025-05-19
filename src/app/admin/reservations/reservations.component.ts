import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSearch, faPlus, faEdit, faTrash, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Reservation, ReservationStatus, PaymentStatus } from '../../models/reservation.model';
import { ReservationService } from '../../services/reservation.service';
import { HotelService } from '../../services/hotel.service';
import { finalize } from 'rxjs';

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

  // Datos y estado
  reservations: Reservation[] = [];
  filteredReservations: Reservation[] = [];
  loading: boolean = false;
  error: string | null = null;
  hotelId: string | null = null;

  constructor(
    private router: Router,
    private reservationService: ReservationService,
    private hotelService: HotelService
  ) { }

  ngOnInit(): void {
    // Obtenemos el ID del hotel desde localStorage
    this.hotelId = this.hotelService.getHotelIdFromStorage();
    if (this.hotelId) {
      this.loadReservations();
    } else {
      this.error = 'No se ha encontrado un hotel asociado a tu cuenta';
    }
  }

  loadReservations(): void {
    if (!this.hotelId) return;

    this.loading = true;
    const params = {
      status: this.statusFilter !== 'todos' ? this.statusFilter : undefined,
      dateFilter: this.dateFilter !== 'todos' ? this.dateFilter : undefined,
      search: this.searchTerm || undefined
    };

    this.reservationService.getReservations(this.hotelId, params)
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (reservations) => {
          this.reservations = reservations;
          this.applyFilters();
        },
        error: (err) => {
          this.error = 'Error al cargar las reservas: ' + err;
        }
      });
  }  applyFilters(): void {
    this.filteredReservations = this.reservations.filter(reservation => {
      const matchesSearch = this.searchTerm === '' || 
        (reservation.roomNumber && reservation.roomNumber.includes(this.searchTerm)) ||
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
    if (this.hotelId) {
      this.loadReservations();
    } else {
      this.applyFilters();
    }
  }

  onStatusFilterChange(): void {
    if (this.hotelId) {
      this.loadReservations();
    } else {
      this.applyFilters();
    }
  }

  onDateFilterChange(): void {
    if (this.hotelId) {
      this.loadReservations();
    } else {
      this.applyFilters();
    }
  }
  onDeleteReservation(id: string | undefined): void {
    if (!this.hotelId || !id) return;

    if (confirm('¿Estás seguro de que deseas eliminar esta reserva?')) {
      this.loading = true;
      this.reservationService.deleteReservation(this.hotelId, id)
        .pipe(
          finalize(() => this.loading = false)
        )
        .subscribe({
          next: () => {
            this.reservations = this.reservations.filter(r => r.id !== id);
            this.applyFilters();
          },
          error: (err) => {
            this.error = 'Error al eliminar la reserva: ' + err;
          }
        });
    }
  }

  onNewReservation(): void {
    this.router.navigate(['/admin/reservations/new']);
  }
}

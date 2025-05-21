import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faSearch, faPlus, faEdit, faTrash, faCheck, faTimes, 
  faMoneyBillWave, faListCheck, faCalendarCheck
} from '@fortawesome/free-solid-svg-icons';
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
export class ReservationsComponent implements OnInit {  // Iconos
  faSearch = faSearch;
  faPlus = faPlus;
  faEdit = faEdit;
  faTrash = faTrash;
  faCheck = faCheck;
  faTimes = faTimes;
  faMoneyBillWave = faMoneyBillWave;
  faListCheck = faListCheck;
  faCalendarCheck = faCalendarCheck;

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
    };    this.reservationService.getReservations(this.hotelId, params)
      .pipe(
        finalize(() => this.loading = false)
      )      .subscribe({
        next: (reservations) => {
          console.log('Datos originales de la API:', reservations);
          // Mapeamos los datos para asegurar compatibilidad con el nuevo formato de respuesta
          this.reservations = reservations.map(res => {
            // Obtenemos datos de los objetos anidados
            const mappedRes = {
              ...res,
              // Extraemos datos del objeto user si existe
              email: res.user?.email || res.userEmail || res.email || '',
              guestName: res.user?.name || res.guestName || '',
              
              // Extraemos datos del objeto room si existe
              roomNumber: res.room?.number || res.roomNumber || '',
              roomType: res.room?.type || res.roomType || '',
              
              // Aseguramos campos básicos para la tabla
              checkIn: res.checkInDate || res.checkIn || '',
              checkOut: res.checkOutDate || res.checkOut || '',
              totalAmount: res.totalPrice || res.totalAmount || 0
            };
            console.log('Reserva mapeada:', mappedRes);
            return mappedRes;
          });
          console.log('Reservaciones procesadas:', this.reservations);
          this.applyFilters();
        },error: (err) => {
          console.error('Error al cargar reservaciones:', err);
          this.error = 'Error al cargar las reservas: ' + err;
          this.filteredReservations = [];
        }
      });
  }  applyFilters(): void {
    console.log('Aplicando filtros:', {
      searchTerm: this.searchTerm,
      statusFilter: this.statusFilter,
      dateFilter: this.dateFilter
    });
    
    if (!this.reservations || this.reservations.length === 0) {
      console.log('No hay reservaciones para filtrar');
      this.filteredReservations = [];
      return;
    }
    
    this.filteredReservations = this.reservations.filter(reservation => {
      // Para búsqueda, aseguramos que existe el campo antes de buscar en él
      const emailToSearch = (reservation.userEmail || reservation.email || '').toLowerCase();
      const roomNumberToSearch = reservation.roomNumber || '';
      
      const matchesSearch = this.searchTerm === '' || 
        roomNumberToSearch.includes(this.searchTerm) ||
        emailToSearch.includes(this.searchTerm.toLowerCase());      const matchesStatus = this.statusFilter === 'todos' || 
        (reservation.status && reservation.status === this.statusFilter);

      const today = new Date();
      // Usamos checkInDate si está disponible, sino checkIn
      const checkInStr = reservation.checkInDate || reservation.checkIn || '';
      const checkOutStr = reservation.checkOutDate || reservation.checkOut || '';
      
      // Solo crear fechas si tenemos strings válidos
      const checkIn = checkInStr ? new Date(checkInStr) : null;
      const checkOut = checkOutStr ? new Date(checkOutStr) : null;

      let matchesDate = true;
      if (this.dateFilter === 'hoy' && checkIn) {
        matchesDate = checkIn.toDateString() === today.toDateString();
      } else if (this.dateFilter === 'semana' && checkIn) {
        const weekFromNow = new Date(today);
        weekFromNow.setDate(today.getDate() + 7);
        matchesDate = checkIn >= today && checkIn <= weekFromNow;
      }      const shouldInclude = matchesSearch && matchesStatus && matchesDate;
      
      // Log para depurar resultados del filtro
      if (this.searchTerm !== '' || this.statusFilter !== 'todos' || this.dateFilter !== 'todos') {
        console.log(`Reserva ${reservation.id}: matches = ${shouldInclude}`, {
          search: matchesSearch,
          status: matchesStatus,
          date: matchesDate
        });
      }
      
      return shouldInclude;
    });
    
    console.log(`Reservaciones filtradas: ${this.filteredReservations.length}`);
  }  getStatusClass(status: string): string {
    if (!status) return '';
    
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'confirmed':
        return 'status-confirmed';
      case 'pending':
        return 'status-pending';
      case 'cancelled':
        return 'status-cancelled';
      case 'checked-in':
        return 'status-checked-in';
      case 'checked-out':
        return 'status-checked-out';
      default:
        return '';
    }
  }
  getPaymentStatusClass(status: string): string {
    if (!status) return '';
    
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'paid':
        return 'payment-paid';
      case 'pending':
        return 'payment-pending';
      case 'refunded':
        return 'payment-refunded';
      default:
        return '';
    }
  }
  
  getStatusLabel(status: string): string {
    if (!status) return '';
    
    switch (status) {
      case 'confirmed': return 'Confirmada';
      case 'pending': return 'Pendiente';
      case 'cancelled': return 'Cancelada';
      case 'checked-in': return 'Check-in realizado';
      case 'checked-out': return 'Check-out realizado';
      default: return status;
    }
  }
  
  getPaymentStatusLabel(status: string): string {
    if (!status) return '';
    
    switch (status) {
      case 'paid': return 'Pagado';
      case 'pending': return 'Pendiente';
      case 'refunded': return 'Reembolsado';
      default: return status;
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
  // Gestión de estados de reserva
  updateReservationStatus(reservation: Reservation, newStatus: string): void {
    if (!this.hotelId || !reservation.id) return;

    this.loading = true;
    this.reservationService.updateReservationStatus(this.hotelId, reservation.id, newStatus)
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (updatedReservation) => {
          // Actualizar la reserva en la lista local
          const index = this.reservations.findIndex(r => r.id === reservation.id);
          if (index !== -1) {
            // Crear una copia actualizada de la reserva
            const updatedReservationWithDetails = {
              ...this.reservations[index],
              ...updatedReservation,
              status: newStatus
            };
            this.reservations[index] = updatedReservationWithDetails;
            this.applyFilters();
            
            // Mostrar notificación de éxito
            const statusLabel = this.getStatusLabel(newStatus);
            this.showNotification(`La reserva ha sido actualizada a estado: ${statusLabel}`);
          }
        },
        error: (err) => {
          this.error = `Error al cambiar el estado de la reserva a ${newStatus}: ${err}`;
          this.showNotification(`Error al cambiar el estado: ${err}`, false);
        }
      });
  }

  // Marcar una reserva como pagada
  markReservationAsPaid(reservation: Reservation): void {
    if (!this.hotelId || !reservation.id) return;

    this.loading = true;
    this.reservationService.markReservationAsPaid(this.hotelId, reservation.id)
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (updatedReservation) => {
          // Actualizar la reserva en la lista local
          const index = this.reservations.findIndex(r => r.id === reservation.id);
          if (index !== -1) {
            // Crear una copia actualizada de la reserva
            const updatedReservationWithDetails = {
              ...this.reservations[index],
              ...updatedReservation,
              paymentStatus: 'paid'
            };
            this.reservations[index] = updatedReservationWithDetails;
            this.applyFilters();
            
            // Mostrar notificación de éxito
            this.showNotification(`El pago de la reserva ha sido registrado correctamente`);
          }
        },
        error: (err) => {
          this.error = `Error al marcar la reserva como pagada: ${err}`;
          this.showNotification(`Error al registrar el pago: ${err}`, false);
        }
      });
  }

  // Verificar si un cambio de estado está permitido
  canChangeStatusTo(currentStatus: string, newStatus: string): boolean {
    if (!currentStatus) return false;
    
    switch (currentStatus) {
      case 'pending':
        return ['confirmed', 'cancelled'].includes(newStatus);
      case 'confirmed':
        return ['cancelled', 'checked-in'].includes(newStatus);
      case 'checked-in':
        return ['checked-out'].includes(newStatus);
      case 'checked-out':
      case 'cancelled':
        return false; // No se permite cambio desde estos estados
      default:
        return false;
    }
  }

  // Obtener los estados a los que se puede cambiar
  getAvailableStatusChanges(currentStatus: string): {value: string, label: string}[] {
    if (!currentStatus) return [];
    
    const allStatuses = [
      { value: 'confirmed', label: 'Confirmar' },
      { value: 'cancelled', label: 'Cancelar' },
      { value: 'checked-in', label: 'Registrar check-in' },
      { value: 'checked-out', label: 'Registrar check-out' }
    ];
    
    return allStatuses.filter(status => this.canChangeStatusTo(currentStatus, status.value));
  }

  // Mostrar una notificación temporal
  showNotification(message: string, isSuccess: boolean = true): void {
    const notification = document.createElement('div');
    notification.className = `notification ${isSuccess ? 'success' : 'error'}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Mostrar la notificación con animación
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
    
    // Remover la notificación después de 3 segundos
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }
}

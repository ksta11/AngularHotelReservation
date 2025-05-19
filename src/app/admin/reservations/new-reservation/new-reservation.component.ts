import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ReservationService } from '../../../services/reservation.service';
import { HotelService } from '../../../services/hotel.service';
import { PaymentStatus } from '../../../models/reservation.model';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-new-reservation',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './new-reservation.component.html',
  styleUrls: ['./new-reservation.component.scss']
})
export class NewReservationComponent implements OnInit {
  reservationForm: FormGroup;
  loading = false;
  error: string | null = null;
  paymentStatusOptions = [
    { value: PaymentStatus.PENDING, label: 'Pendiente' },
    { value: PaymentStatus.PAID, label: 'Pagado' }
  ];

  constructor(
    private fb: FormBuilder, 
    private reservationService: ReservationService, 
    private hotelService: HotelService,
    private router: Router
  ) {    this.reservationForm = this.fb.group({
      userEmail: ['', [Validators.required, Validators.email]],
      roomNumber: ['', Validators.required],
      checkInDate: ['', Validators.required],
      checkOutDate: ['', Validators.required],
      totalPrice: ['', [Validators.required, Validators.min(0)]],
      specialRequests: [''],
      paymentStatus: ['pending', Validators.required]
    });
  }
  hotelId: string | null = null;

  ngOnInit(): void {
    this.hotelId = this.hotelService.getHotelIdFromStorage();
    if (!this.hotelId) {
      this.error = 'No se ha encontrado un hotel asociado a tu cuenta';
    }
  }

  onSubmit(): void {
    if (this.reservationForm.valid && this.hotelId) {
      this.loading = true;
      // Siempre establecemos el status como 'confirmed'
      const reservationData = {
        ...this.reservationForm.value,
        status: 'confirmed'
      };

      this.reservationService.createReservation(this.hotelId, reservationData)
        .pipe(
          finalize(() => this.loading = false)
        )
        .subscribe({
          next: (newReservation) => {
            console.log('Reserva creada:', newReservation);
            this.router.navigate(['/admin/reservations']);
          },
          error: (err) => {
            this.error = 'Error al crear la reserva: ' + err;
          }
        });
    }
  }

  onCancel(): void {
    window.history.back();
  }
} 
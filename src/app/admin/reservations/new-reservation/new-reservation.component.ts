import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

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

  constructor(private fb: FormBuilder) {
    this.reservationForm = this.fb.group({
      guestName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      roomNumber: ['', Validators.required],
      roomType: ['', Validators.required],
      checkIn: ['', Validators.required],
      checkOut: ['', Validators.required],
      totalAmount: ['', [Validators.required, Validators.min(0)]],
      specialRequests: ['']
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.reservationForm.valid) {
      console.log('Formulario enviado:', this.reservationForm.value);
      // Aquí irá la lógica para guardar la reserva
    }
  }

  onCancel(): void {
    // Aquí podemos implementar la lógica para cancelar
    window.history.back();
  }
} 
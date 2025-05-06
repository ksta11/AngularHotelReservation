import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Hotel } from '../../models/hotel.model';

@Component({
  selector: 'app-hotel-info',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './hotel-info.component.html',
  styleUrls: ['./hotel-info.component.scss']
})
export class HotelInfoComponent implements OnInit {
  hotelForm: FormGroup;
  amenities: string[] = [
    'WiFi Gratuito',
    'Piscina',
    'Gimnasio',
    'Restaurante',
    'Estacionamiento',
    'Servicio de Habitaciones',
    'Spa',
    'Salón de Eventos'
  ];

  constructor(private fb: FormBuilder) {
    this.hotelForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      address: this.fb.group({
        city: ['', Validators.required],
        country: ['', Validators.required]
      }),
      contactInfo: this.fb.group({
        phone: ['', [Validators.required, Validators.pattern('^[0-9+()-\\s]{10,}$')]],
        email: ['', [Validators.required, Validators.email]]
      }),
      policies: this.fb.group({
        checkInTime: ['', Validators.required],
        checkOutTime: ['', Validators.required],
        cancellationPolicy: ['', [Validators.required, Validators.minLength(10)]]
      }),
      selectedAmenities: this.fb.array([])
    });
  }

  ngOnInit(): void {
    // Aquí podrías cargar los datos del hotel si ya existen
  }

  onSubmit(): void {
    if (this.hotelForm.valid) {
      console.log(this.hotelForm.value);
      // Aquí iría la lógica para guardar los datos
    }
  }
}

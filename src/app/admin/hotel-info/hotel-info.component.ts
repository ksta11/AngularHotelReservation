import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Hotel } from '../../models/hotel.model';
import { AuthService } from '../../auth/services/auth.service';
import { HotelService } from '../../services/hotel.service';
import { Router } from '@angular/router';

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
  constructor(
    private fb: FormBuilder, 
    private authService: AuthService,
    private hotelService: HotelService,
    private router: Router
  ) {
    this.hotelForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      address: this.fb.group({
        street: ['', Validators.required],
        city: ['', Validators.required],
        country: ['', Validators.required],
        zipCode: ['', Validators.required]
      }),
      contactInfo: this.fb.group({
        phone: ['', [Validators.required, Validators.pattern('^[0-9+()-\\s]{10,}$')]]
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
  }  onSubmit(): void {
    if (this.hotelForm.valid) {
      // Obtener el usuario actual con el email y userId desde el servicio de autenticación
      const currentUser = this.authService.getCurrentUser();
      const email = currentUser?.email || '';
      const userId = currentUser?.id || '';
      
      if (!userId) {
        console.error('No se pudo obtener el ID del usuario desde el token');
        alert('Error: No se pudo identificar al usuario. Intente iniciar sesión nuevamente.');
        return;
      }
      
      // Crear objeto final con los datos del formulario y el email desde el token
      const formValue = this.hotelForm.value;
        // Formatear los datos según la estructura esperada por la API
      const hotelData = {
        name: formValue.name,
        address: formValue.address.street,
        description: formValue.description,
        city: formValue.address.city,
        country: formValue.address.country,
        postalCode: formValue.address.zipCode,
        phone: formValue.contactInfo.phone,
        email: email,
        checkInTime: formValue.policies.checkInTime,
        checkOutTime: formValue.policies.checkOutTime,
        cancellationPolicy: formValue.policies.cancellationPolicy,
        userId: userId
      };
      
      console.log('Enviando datos del hotel:', hotelData);
      
      // Llamar al servicio para crear el hotel
      this.hotelService.createHotel(hotelData).subscribe({
        next: (response) => {
          console.log('Hotel creado correctamente:', response);
          // Redirigir al dashboard o a otra página tras la creación exitosa
          this.router.navigate(['/admin/dashboard']);
        },
        error: (error) => {
          console.error('Error al crear el hotel:', error);
          // Aquí podrías mostrar un mensaje de error al usuario
          alert('Error al crear el hotel: ' + error);
        }
      });
    } else {
      // Marcar todos los campos como tocados para mostrar los errores de validación
      this.markFormGroupTouched(this.hotelForm);
      alert('Por favor, complete todos los campos requeridos correctamente.');
    }
  }
  
  // Función auxiliar para marcar todos los campos del formulario como tocados
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
      
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}

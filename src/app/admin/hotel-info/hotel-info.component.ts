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
  hotel: Hotel | null = null;
  loading: boolean = true;
  error: string | null = null;
  hotelForm: FormGroup;
  isEditMode: boolean = false;
  
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
    // Inicializar el formulario vacío para edición posterior
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
  }  ngOnInit(): void {
    this.loadHotelData();
  }
  
  loadHotelData(): void {
    // Obtenemos el userId del usuario autenticado actual
    const currentUser = this.authService.getCurrentUser();
    const userId = currentUser?.id;
    
    if (!userId) {
      this.error = 'No se pudo obtener la información del usuario. Inicie sesión nuevamente.';
      this.loading = false;
      return;
    }
    
    // Obtener el hotel asociado al usuario actual
    this.hotelService.getHotelByUserId(userId).subscribe({
      next: (hotel: Hotel) => {
        this.hotel = hotel;
        this.loading = false;
        
        // Si tenemos datos del hotel, pre-llenamos el formulario para una posible edición
        if (hotel) {
          this.hotelForm.patchValue({
            name: hotel.name,
            description: hotel.description,
            address: {
              street: hotel.address,
              city: hotel.city,
              country: hotel.country,
              zipCode: hotel.postalCode
            },
            contactInfo: {
              phone: hotel.phone
            },
            policies: {
              checkInTime: hotel.checkInTime,
              checkOutTime: hotel.checkOutTime,
              cancellationPolicy: hotel.cancellationPolicy
            }
          });
        }
      },
      error: (error: any) => {
        this.error = 'Error al cargar la información del hotel: ' + error;
        this.loading = false;
      }
    });
  }
  
  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
  }
    onSubmit(): void {
    if (this.hotelForm.valid && this.hotel?.id) {
      // Obtener el usuario actual con el email y userId desde el servicio de autenticación
      const currentUser = this.authService.getCurrentUser();
      const email = currentUser?.email || '';
      const userId = currentUser?.id || '';
      
      if (!userId) {
        console.error('No se pudo obtener el ID del usuario desde el token');
        alert('Error: No se pudo identificar al usuario. Intente iniciar sesión nuevamente.');
        return;
      }
      
      // Formatear los datos del formulario
      const formValue = this.hotelForm.value;
      const hotelData: Partial<Hotel> = {
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
      
      // Actualizar el hotel existente en lugar de crear uno nuevo
      this.hotelService.updateHotel(this.hotel.id, hotelData).subscribe({
        next: (response) => {
          console.log('Hotel actualizado correctamente:', response);
          this.hotel = response;
          this.isEditMode = false;
          alert('¡Información del hotel actualizada correctamente!');
        },
        error: (error: any) => {
          console.error('Error al actualizar el hotel:', error);
          alert('Error al actualizar el hotel: ' + error);
        }      });
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

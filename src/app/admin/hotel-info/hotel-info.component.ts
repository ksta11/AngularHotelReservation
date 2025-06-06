import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Hotel } from '../../models/hotel.model';
import { AuthService } from '../../auth/services/auth.service';
import { HotelService } from '../../services/hotel.service';
import { CloudinaryService } from '../../services/cloudinary.service';
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
  
  // Variables para gestionar la imagen
  selectedImage: File | null = null;
  imagePreview: string | null = null;
  
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
    private cloudinaryService: CloudinaryService,
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
        
        // Si el hotel tiene una imagen, mostrarla en la vista previa
        if (hotel.imageUrl) {
          this.imagePreview = hotel.imageUrl;
        }
        
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
      this.loading = true;
      
      // Obtener el usuario actual con el email y userId desde el servicio de autenticación
      const currentUser = this.authService.getCurrentUser();
      const email = currentUser?.email || '';
      const userId = currentUser?.id || '';
      
      if (!userId) {
        console.error('No se pudo obtener el ID del usuario desde el token');
        this.error = 'No se pudo identificar al usuario. Intente iniciar sesión nuevamente.';
        this.loading = false;
        return;
      }
      
      // Crear objeto final con los datos del formulario
      const formValue = this.hotelForm.value;
        // Si hay una imagen seleccionada, primero subir la imagen
      if (this.selectedImage) {
        this.cloudinaryService.uploadImage(this.selectedImage, 'hotels', this.hotel.id).subscribe({
          next: (response) => {
            if (response && response.imageUrl) {
              console.log('Imagen subida correctamente:', response);
              this.updateHotel(formValue, email, userId, response.imageUrl);
            } else {
              console.error('Error: No se recibió la URL de la imagen');
              alert('Error: No se pudo subir la imagen. Se mantendrá la imagen actual.');
              this.updateHotel(formValue, email, userId, this.hotel?.imageUrl);
              this.loading = false;
            }
          },
          error: (error) => {
            console.error('Error al subir la imagen:', error);
            alert('Error al subir la imagen. Se mantendrá la imagen actual.');
            // Continuar con la actualización del hotel sin cambiar la imagen
            this.updateHotel(formValue, email, userId, this.hotel?.imageUrl);
            this.loading = false;
          }
        });
      } else {
        // Actualizar el hotel sin cambiar la imagen
        this.updateHotel(formValue, email, userId, this.hotel?.imageUrl);
      }
    } else {
      // Marcar todos los campos como tocados para mostrar los errores de validación
      this.markFormGroupTouched(this.hotelForm);
      alert('Por favor, complete todos los campos requeridos correctamente.');
    }
  }
  
  private updateHotel(formValue: any, email: string, userId: string, imageUrl?: string): void {
    if (!this.hotel?.id) return;
    
    // Formatear los datos según la estructura esperada por la API
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
    
    // Añadir la URL de la imagen si existe
    if (imageUrl) {
      hotelData.imageUrl = imageUrl;
    }
    
    // Actualizar el hotel existente en lugar de crear uno nuevo
    this.hotelService.updateHotel(this.hotel.id, hotelData).subscribe({
      next: (response) => {
        console.log('Hotel actualizado correctamente:', response);
        this.hotel = response;
        this.isEditMode = false;
        this.loading = false;
        alert('¡Información del hotel actualizada correctamente!');
      },
      error: (error: any) => {
        console.error('Error al actualizar el hotel:', error);
        this.loading = false;
        alert('Error al actualizar el hotel: ' + error);
      }
    });
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

  onImageSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedImage = fileInput.files[0];
      
      // Crear una vista previa de la imagen
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.selectedImage);
    }
  }

  removeImage(): void {
    this.selectedImage = null;
    // Si estamos editando y ya había una imagen, mantener la original
    this.imagePreview = this.hotel?.imageUrl || null;
  }
}

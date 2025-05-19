import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Hotel } from '../../models/hotel.model';
import { AuthService } from '../../auth/services/auth.service';
import { HotelService } from '../../services/hotel.service';

@Component({
  selector: 'app-create-hotel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './create-hotel.component.html',
  styleUrl: './create-hotel.component.scss'
})
export class CreateHotelComponent implements OnInit {
  hotelForm: FormGroup;
  isSubmitting: boolean = false;
  
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
      })
    });
  }

  ngOnInit(): void {}

  showConfirmation(): void {
    if (this.hotelForm.invalid) {
      this.markFormGroupTouched(this.hotelForm);
      return;
    }

    const confirmMessage = '¡ATENCIÓN! Al registrar un hotel, su cuenta será convertida de cliente a administrador de hotel. ' +
      'Si continúa, deberá cerrar sesión y volver a iniciar para aplicar los cambios. ¿Desea continuar?';
    
    if (window.confirm(confirmMessage)) {
      this.onSubmit();
    }
  }

  onSubmit(): void {
    if (this.hotelForm.valid) {
      this.isSubmitting = true;
      
      // Obtener el usuario actual con el email y userId desde el servicio de autenticación
      const currentUser = this.authService.getCurrentUser();
      const email = currentUser?.email || '';
      const userId = currentUser?.id || '';
      
      if (!userId) {
        console.error('No se pudo obtener el ID del usuario desde el token');
        alert('Error: No se pudo identificar al usuario. Intente iniciar sesión nuevamente.');
        this.isSubmitting = false;
        return;
      }
      
      // Crear objeto final con los datos del formulario y el email desde el token
      const formValue = this.hotelForm.value;
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
      
      console.log('Enviando datos del hotel:', hotelData);
      
      // Llamar al servicio para crear el hotel
      this.hotelService.createHotel(hotelData).subscribe({
        next: (response) => {
          console.log('Hotel creado correctamente:', response);
          alert('¡Hotel creado correctamente! Para aplicar los cambios de rol, se cerrará la sesión. Por favor, vuelva a iniciar sesión.');
          
          // Cerrar sesión y redirigir al login
          this.authService.logout();
          this.router.navigate(['/auth/login']);
        },
        error: (error) => {
          console.error('Error al crear el hotel:', error);
          this.isSubmitting = false;
          alert('Error al crear el hotel: ' + error);
        }
      });
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

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser, faEnvelope, faPhone, faSave, faTimes, faEdit, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../auth/services/auth.service';
import { createAvatar } from '@dicebear/core';
import { bottts } from '@dicebear/collection';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, FontAwesomeModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  // Iconos
  faUser = faUser;
  faEnvelope = faEnvelope;
  faPhone = faPhone;
  faSave = faSave;
  faTimes = faTimes;
  faEdit = faEdit;
  faUserCircle = faUserCircle;

  profileForm: FormGroup;
  loading: boolean = false;
  error: string | null = null;
  successMessage: string | null = null;
  isEditing: boolean = false;
  avatarUrl: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]]
    });
  }

  async ngOnInit(): Promise<void> {
    await this.generateAvatar();
    this.loadProfile();
  }

  async generateAvatar(): Promise<void> {
    const avatar = createAvatar(bottts, {
      seed: this.profileForm.get('email')?.value || 'default',
      backgroundColor: ['ffffff'],
      radius: 50
    });

    this.avatarUrl = avatar.toDataUri();
  }

  loadProfile(): void {
    this.loading = true;
    this.error = null;
    
    // Simulación de carga de datos del perfil
    setTimeout(() => {
      const mockUser = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan.perez@example.com',
        phone: '1234567890'
      };
      
      this.profileForm.patchValue(mockUser);
      this.generateAvatar(); // Regenerar avatar con el nuevo email
      this.loading = false;
    }, 1000);
  }

  toggleEditMode(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.loadProfile(); // Recargar datos originales al cancelar
    }
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.loading = true;
      this.error = null;
      this.successMessage = null;

      // Simulación de actualización
      setTimeout(() => {
        this.loading = false;
        this.successMessage = 'Perfil actualizado exitosamente';
        this.isEditing = false;
      }, 1000);
    }
  }

  getErrorMessage(controlName: string): string {
    const control = this.profileForm.get(controlName);
    if (control?.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (control?.hasError('email')) {
      return 'Ingrese un email válido';
    }
    if (control?.hasError('pattern')) {
      return 'Ingrese un número de teléfono válido (10 dígitos)';
    }
    return '';
  }
} 
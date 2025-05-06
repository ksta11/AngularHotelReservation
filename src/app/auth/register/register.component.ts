import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faGoogle, faFacebook } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';
  loading: boolean = false;
  faGoogle = faGoogle;
  faFacebook = faFacebook;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    }
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      const { name, email, password } = this.registerForm.value;

      this.authService.register({ name, email, password }).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/auth/login']);
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = 'Error al registrar usuario. Por favor, intenta nuevamente.';
          console.error('Error de registro:', error);
        }
      });
    }
  }

  registerWithGoogle(): void {
    this.loading = true;
    this.errorMessage = '';
    // TODO: Implementar registro con Google
    console.log('Registro con Google');
    this.loading = false;
  }

  registerWithFacebook(): void {
    this.loading = true;
    this.errorMessage = '';
    // TODO: Implementar registro con Facebook
    console.log('Registro con Facebook');
    this.loading = false;
  }
}

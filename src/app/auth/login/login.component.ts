import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faGoogle, faFacebook } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';
  loading: boolean = false;
  faGoogle = faGoogle;
  faFacebook = faFacebook;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // Removemos la redirección automática para desarrollo
  }
  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      const { email, password } = this.loginForm.value;

      this.authService.login(email, password).subscribe({
        next: (_response) => {
          this.loading = false;
          
          // Verificar si hay un token válido
          if (!this.authService.isAuthenticated()) {
            this.errorMessage = 'Sesión no válida. Por favor, inicie sesión nuevamente.';
            return;
          }
          
          // Obtener el rol directamente del token decodificado
          const userRole = this.authService.getUserRoleFromToken();
          
          // Redirigir según el rol del usuario
          if (userRole === 'admin' || userRole === 'hotel_admin') {
            this.router.navigate(['/admin/dashboard']);
          } else {
            this.router.navigate(['/dashboard']);
          }
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = 'Error al iniciar sesión. Por favor, verifica tus credenciales.';
          console.error('Error de login:', error);
        }
      });
    }
  }

  loginWithGoogle(): void {
    this.loading = true;
    this.errorMessage = '';
    // TODO: Implementar login con Google
    console.log('Login con Google');
    this.loading = false;
  }

  loginWithFacebook(): void {
    this.loading = true;
    this.errorMessage = '';
    // TODO: Implementar login con Facebook
    console.log('Login con Facebook');
    this.loading = false;
  }
}

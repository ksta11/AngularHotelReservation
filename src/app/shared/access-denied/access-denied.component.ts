import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-access-denied',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="access-denied-container">
      <div class="access-denied-card">
        <h1>Acceso Denegado</h1>
        <p>No tienes permisos para acceder a esta página.</p>
        <div class="access-denied-actions">
          <a routerLink="/auth/login" class="btn-primary">Iniciar Sesión</a>
          <a routerLink="/" class="btn-secondary">Volver a Inicio</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .access-denied-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #f8f9fa;
    }
    
    .access-denied-card {
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      padding: 2rem;
      max-width: 500px;
      text-align: center;
    }
    
    h1 {
      color: #dc3545;
      margin-bottom: 1rem;
    }
    
    p {
      color: #6c757d;
      margin-bottom: 2rem;
      font-size: 1.1rem;
    }
    
    .access-denied-actions {
      display: flex;
      justify-content: center;
      gap: 1rem;
    }
    
    .btn-primary, .btn-secondary {
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      text-decoration: none;
      font-weight: 500;
      transition: background-color 0.2s;
    }
    
    .btn-primary {
      background-color: #0d6efd;
      color: white;
    }
    
    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }
    
    .btn-primary:hover {
      background-color: #0b5ed7;
    }
    
    .btn-secondary:hover {
      background-color: #5c636a;
    }
  `]
})
export class AccessDeniedComponent {}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSave, faTimes } from '@fortawesome/free-solid-svg-icons';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'hotel' | 'client';
  status: 'active' | 'inactive';
  createdAt: string;
  lastLogin?: string;
}

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, FontAwesomeModule],
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {
  // Iconos
  faSave = faSave;
  faTimes = faTimes;

  user: User = {
    id: 0,
    name: '',
    email: '',
    role: 'client',
    status: 'active',
    createdAt: new Date().toISOString(),
  };

  isNewUser: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.isNewUser = false;
      // Aquí normalmente cargaríamos los datos del usuario desde un servicio
      // Por ahora usamos datos de ejemplo
      this.user = {
        id: parseInt(userId),
        name: 'Usuario Ejemplo',
        email: 'usuario@ejemplo.com',
        role: 'client',
        status: 'active',
        createdAt: '2024-03-20',
        lastLogin: '2024-03-20'
      };
    }
  }

  onSubmit(): void {
    // Aquí normalmente guardaríamos los cambios en el backend
    console.log('Guardando usuario:', this.user);
    this.router.navigate(['/admin/users']);
  }

  onCancel(): void {
    this.router.navigate(['/admin/users']);
  }
} 
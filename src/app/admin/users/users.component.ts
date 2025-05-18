import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSearch, faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

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
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, FontAwesomeModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  // Iconos
  faSearch = faSearch;
  faPlus = faPlus;
  faEdit = faEdit;
  faTrash = faTrash;

  // Filtros
  searchTerm: string = '';
  roleFilter: string = 'todos';
  statusFilter: string = 'todos';

  // Datos de ejemplo
  users: User[] = [
    {
      id: 1,
      name: 'Admin Principal',
      email: 'admin@hotel.com',
      role: 'admin',
      status: 'active',
      createdAt: '2024-01-01',
      lastLogin: '2024-03-20'
    },
    {
      id: 2,
      name: 'Hotel Plaza',
      email: 'plaza@hotel.com',
      role: 'hotel',
      status: 'active',
      createdAt: '2024-01-15',
      lastLogin: '2024-03-19'
    },
    {
      id: 3,
      name: 'Juan Cliente',
      email: 'cliente@email.com',
      role: 'client',
      status: 'active',
      createdAt: '2024-02-01',
      lastLogin: '2024-03-18'
    }
  ];

  filteredUsers: User[] = [];

  constructor() { }

  ngOnInit(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = this.searchTerm === '' || 
        user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesRole = this.roleFilter === 'todos' || 
        user.role === this.roleFilter;

      const matchesStatus = this.statusFilter === 'todos' || 
        user.status === this.statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }

  getRoleClass(role: string): string {
    switch (role) {
      case 'admin':
        return 'role-admin';
      case 'hotel':
        return 'role-hotel';
      case 'client':
        return 'role-client';
      default:
        return '';
    }
  }

  getStatusClass(status: string): string {
    return status === 'active' ? 'status-active' : 'status-inactive';
  }

  onSearch(): void {
    this.applyFilters();
  }

  onRoleFilterChange(): void {
    this.applyFilters();
  }

  onStatusFilterChange(): void {
    this.applyFilters();
  }

  onDeleteUser(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      this.users = this.users.filter(u => u.id !== id);
      this.applyFilters();
    }
  }
} 
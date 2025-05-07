import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBell, faCheck, faTimes, faTrash, faFilter } from '@fortawesome/free-solid-svg-icons';

interface Notification {
  id: number;
  type: 'reservation' | 'review' | 'maintenance' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'high' | 'medium' | 'low';
}

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, FontAwesomeModule],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[] = [];
  filteredNotifications: Notification[] = [];
  selectedFilter: string = 'all';
  searchTerm: string = '';

  // Icons
  faBell = faBell;
  faCheck = faCheck;
  faTimes = faTimes;
  faTrash = faTrash;
  faFilter = faFilter;

  constructor() {}

  ngOnInit(): void {
    // Simulación de datos - En producción esto vendría de un servicio
    this.notifications = [
      {
        id: 1,
        type: 'reservation',
        title: 'Nueva Reserva',
        message: 'Se ha recibido una nueva reserva para la habitación 101',
        timestamp: new Date(),
        read: false,
        priority: 'high'
      },
      {
        id: 2,
        type: 'review',
        title: 'Nueva Reseña',
        message: 'Un cliente ha dejado una reseña de 5 estrellas',
        timestamp: new Date(Date.now() - 3600000),
        read: true,
        priority: 'medium'
      },
      {
        id: 3,
        type: 'maintenance',
        title: 'Mantenimiento Programado',
        message: 'Mantenimiento programado para la habitación 203',
        timestamp: new Date(Date.now() - 7200000),
        read: false,
        priority: 'high'
      }
    ];
    this.filteredNotifications = [...this.notifications];
  }

  filterNotifications(): void {
    this.filteredNotifications = this.notifications.filter(notification => {
      const matchesFilter = this.selectedFilter === 'all' || 
                          notification.type === this.selectedFilter;
      const matchesSearch = !this.searchTerm || 
                          notification.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                          notification.message.toLowerCase().includes(this.searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }

  markAsRead(notification: Notification): void {
    notification.read = true;
  }

  markAllAsRead(): void {
    this.notifications.forEach(notification => notification.read = true);
  }

  deleteNotification(notification: Notification): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta notificación?')) {
      this.notifications = this.notifications.filter(n => n.id !== notification.id);
      this.filterNotifications();
    }
  }

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      case 'low':
        return 'priority-low';
      default:
        return '';
    }
  }

  getTypeIcon(type: string): string {
    switch (type) {
      case 'reservation':
        return 'calendar';
      case 'review':
        return 'star';
      case 'maintenance':
        return 'tools';
      case 'system':
        return 'cog';
      default:
        return 'bell';
    }
  }
}

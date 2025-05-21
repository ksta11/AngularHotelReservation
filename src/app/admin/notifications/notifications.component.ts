import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBell, faCheck, faTimes, faTrash, faFilter } from '@fortawesome/free-solid-svg-icons';
import { NotificationService, Notification } from '../../../app/services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, FontAwesomeModule],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  filteredNotifications: Notification[] = [];
  selectedFilter: string = 'all';
  searchTerm: string = '';
  private subscription: Subscription = new Subscription();

  // Icons
  faBell = faBell;
  faCheck = faCheck;
  faTimes = faTimes;
  faTrash = faTrash;
  faFilter = faFilter;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    // Suscribirse a las notificaciones del servicio
    this.subscription.add(
      this.notificationService.notifications$.subscribe((notifications: Notification[]) => {
        this.notifications = notifications;
        this.filterNotifications();
      })
    );
  }

  ngOnDestroy(): void {
    // Cancelar suscripciones para evitar memory leaks
    this.subscription.unsubscribe();
  }
  filterNotifications(): void {
    this.filteredNotifications = this.notifications.filter(notification => {
      const matchesFilter = this.selectedFilter === 'all' || 
                          notification.type === this.selectedFilter;
      const matchesSearch = !this.searchTerm || 
                          notification.message.toLowerCase().includes(this.searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }

  markAsRead(notification: Notification): void {
    this.notificationService.markAsRead(notification.id);
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead();
  }

  deleteNotification(notification: Notification): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta notificación?')) {
      this.notificationService.deleteNotification(notification.id);
    }
  }

  getTypeClass(type: string): string {
    switch (type) {
      case 'info':
        return 'notification-info';
      case 'success':
        return 'notification-success';
      case 'warning':
        return 'notification-warning';
      case 'error':
        return 'notification-error';
      default:
        return 'notification-info';
    }
  }
}

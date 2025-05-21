import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { NotificationService } from '../../../../app/services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule],
  template: `
    <div class="notification-bell-container">
      <a [routerLink]="['/admin/notifications']" class="notification-bell">
        <fa-icon [icon]="faBell"></fa-icon>
        <span *ngIf="unreadCount > 0" class="badge">{{ unreadCount }}</span>
      </a>
    </div>
  `,
  styles: [`
    .notification-bell-container {
      position: relative;
      display: inline-block;
    }
    
    .notification-bell {
      color: #fff;
      font-size: 1.2em;
      cursor: pointer;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
    }
    
    .badge {
      position: absolute;
      top: 0;
      right: 0;
      background-color: #e74c3c;
      color: white;
      border-radius: 50%;
      width: 18px;
      height: 18px;
      font-size: 0.7em;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `]
})
export class NotificationBellComponent implements OnInit, OnDestroy {
  unreadCount: number = 0;
  private subscription: Subscription = new Subscription();
  faBell = faBell;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.subscription.add(
      this.notificationService.unreadCount$.subscribe(count => {
        this.unreadCount = count;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

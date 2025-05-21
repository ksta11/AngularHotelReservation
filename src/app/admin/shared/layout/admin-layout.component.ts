import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NotificationBellComponent } from '../notification-bell/notification-bell.component';

@Component({  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, NotificationBellComponent],
  template: `
    <div class="admin-layout">
      <app-sidebar></app-sidebar>      <div class="content-area">
        <header class="content-header">
          <h1>Sistema de Administración Hotelera</h1>
          <div class="header-actions">
            <app-notification-bell></app-notification-bell>
          </div>
        </header>
        <main class="content-main">
          <router-outlet></router-outlet>
        </main>
        <footer class="content-footer">
          <p>© {{ currentYear }} Sistema de Reservas Hoteleras</p>
        </footer>
      </div>
    </div>
  `,
  styles: [`
    .admin-layout {
      display: flex;
      min-height: 100vh;
      background-color: #f8f9fa;
    }
    
    .content-area {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
      .content-header {
      padding: 1rem 2rem;
      background-color: #fff;
      border-bottom: 1px solid #dee2e6;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      h1 {
        margin: 0;
        font-size: 1.5rem;
        font-weight: 600;
        color: #495057;
      }

      .header-actions {
        display: flex;
        align-items: center;
        gap: 1rem;
      }
    }
    
    .content-main {
      flex: 1;
      padding: 2rem;
      overflow-y: auto;
    }
    
    .content-footer {
      padding: 1rem 2rem;
      border-top: 1px solid #dee2e6;
      text-align: center;
      
      p {
        margin: 0;
        color: #6c757d;
        font-size: 0.9rem;
      }
    }
  `]
})
export class AdminLayoutComponent {
  currentYear: number = new Date().getFullYear();
}

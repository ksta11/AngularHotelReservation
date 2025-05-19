import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faTachometerAlt, faHotel, faBed, faCalendarCheck,
  faStar, faChartBar, faUsers, faBell, faSignOutAlt 
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule],
  template: `
    <div class="sidebar">
      <div class="sidebar-header">
        <h3>Panel de Administración</h3>
        <p>{{ userRoleDisplay }}</p>
      </div>
      <nav class="sidebar-nav">
        <ul>          <ng-container *ngIf="isHotelAdmin || isAdmin">
            <li>
              <a routerLink="/admin/dashboard" routerLinkActive="active">
                <fa-icon [icon]="faTachometerAlt"></fa-icon>
                <span>Dashboard</span>
              </a>
            </li>
            <li>
              <a routerLink="/admin/hotel-info" routerLinkActive="active">
                <fa-icon [icon]="faHotel"></fa-icon>
                <span>Información del Hotel</span>
              </a>
            </li>
            <li>
              <a routerLink="/admin/room-management" routerLinkActive="active">
                <fa-icon [icon]="faBed"></fa-icon>
                <span>Gestión de Habitaciones</span>
              </a>
            </li>
            <li>
              <a routerLink="/admin/reservations" routerLinkActive="active">
                <fa-icon [icon]="faCalendarCheck"></fa-icon>
                <span>Reservaciones</span>
              </a>
            </li>
            <li>
              <a routerLink="/admin/reviews" routerLinkActive="active">
                <fa-icon [icon]="faStar"></fa-icon>
                <span>Reseñas</span>
              </a>
            </li>
            <li>
              <a routerLink="/admin/reports" routerLinkActive="active">
                <fa-icon [icon]="faChartBar"></fa-icon>
                <span>Reportes</span>
              </a>
            </li>
          </ng-container>
          
          <ng-container *ngIf="isAdmin">
            <li>
              <a routerLink="/admin/users" routerLinkActive="active">
                <fa-icon [icon]="faUsers"></fa-icon>
                <span>Gestión de Usuarios</span>
              </a>
            </li>
            <li>
              <a routerLink="/admin/notifications" routerLinkActive="active">
                <fa-icon [icon]="faBell"></fa-icon>
                <span>Notificaciones</span>
              </a>
            </li>
          </ng-container>
        </ul>
      </nav>      <div class="sidebar-footer">
        <button (click)="logout()" class="logout-btn">
          <fa-icon [icon]="faSignOutAlt"></fa-icon>
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .sidebar {
      display: flex;
      flex-direction: column;
      width: 250px;
      height: 100%;
      background-color: #343a40;
      color: #f8f9fa;
    }
    
    .sidebar-header {
      padding: 1rem;
      border-bottom: 1px solid #495057;
      
      h3 {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 600;
      }
      
      p {
        margin: 0.25rem 0 0;
        font-size: 0.85rem;
        color: #adb5bd;
      }
    }
    
    .sidebar-nav {
      flex-grow: 1;
      padding: 1rem 0;
      
      ul {
        list-style: none;
        padding: 0;
        margin: 0;
        
        li {
          margin-bottom: 0.25rem;
          
          a {
            display: flex;
            align-items: center;
            padding: 0.75rem 1.25rem;
            color: #adb5bd;
            text-decoration: none;
            transition: all 0.2s;
            
            i {
              margin-right: 0.75rem;
              width: 20px;
              text-align: center;
            }
            
            &:hover, &.active {
              color: #fff;
              background-color: rgba(255, 255, 255, 0.1);
              border-left: 4px solid #0d6efd;
            }
            
            &.active {
              font-weight: 600;
            }
          }
        }
      }
    }
    
    .sidebar-footer {
      padding: 1rem;
      border-top: 1px solid #495057;
      
      .logout-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        padding: 0.75rem;
        background-color: rgba(255, 255, 255, 0.1);
        color: #f8f9fa;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.2s;
        
        i {
          margin-right: 0.5rem;
        }
        
        &:hover {
          background-color: rgba(255, 255, 255, 0.15);
        }
      }
    }
  `]
})
export class SidebarComponent implements OnInit {
  isAdmin: boolean = false;
  isHotelAdmin: boolean = false;
  userRoleDisplay: string = '';
  
  // Icons
  faTachometerAlt = faTachometerAlt;
  faHotel = faHotel;
  faBed = faBed;
  faCalendarCheck = faCalendarCheck;
  faStar = faStar;
  faChartBar = faChartBar;
  faUsers = faUsers;
  faBell = faBell;
  faSignOutAlt = faSignOutAlt;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const userRole = this.authService.getUserRoleFromToken();
    
    this.isAdmin = userRole === 'admin';
    this.isHotelAdmin = userRole === 'hotel_admin';
    
    if (this.isAdmin) {
      this.userRoleDisplay = 'Administrador del Sistema';
    } else if (this.isHotelAdmin) {
      this.userRoleDisplay = 'Administrador de Hotel';
    } else {
      this.userRoleDisplay = 'Usuario';
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}

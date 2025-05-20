import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faTachometerAlt, faHotel, faBed, faCalendarCheck,
  faStar, faChartBar, faUsers, faBell, faSignOutAlt,
  faHome, faSearch, faBookmark, faUser, faSignInAlt, faUserPlus
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule],
  template: `
    <div class="sidebar">
      <div class="sidebar-header">
        <h3>Hotel Reservation</h3>
        <p *ngIf="isAuthenticated">{{ userRoleDisplay }}</p>
      </div>
      <nav class="sidebar-nav">
        <ul>
          <!-- Menú para usuarios no autenticados -->
          <ng-container *ngIf="!isAuthenticated">
            <li>
              <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
                <fa-icon [icon]="faHome"></fa-icon>
                <span>Inicio</span>
              </a>
            </li>
            <li>
              <a routerLink="/search" routerLinkActive="active">
                <fa-icon [icon]="faSearch"></fa-icon>
                <span>Buscar Hoteles</span>
              </a>
            </li>
            <li>
              <a routerLink="/auth/login" routerLinkActive="active">
                <fa-icon [icon]="faSignInAlt"></fa-icon>
                <span>Iniciar Sesión</span>
              </a>
            </li>
            <li>
              <a routerLink="/auth/register" routerLinkActive="active">
                <fa-icon [icon]="faUserPlus"></fa-icon>
                <span>Registrarse</span>
              </a>
            </li>
          </ng-container>          <!-- Menú para clientes -->
          <ng-container *ngIf="isAuthenticated && isClient">
            <li>
              <a routerLink="/client/dashboard" routerLinkActive="active">
                <fa-icon [icon]="faTachometerAlt"></fa-icon>
                <span>Dashboard</span>
              </a>
            </li>
            <li>
              <a routerLink="/client/bookings" routerLinkActive="active">
                <fa-icon [icon]="faBookmark"></fa-icon>
                <span>Mis Reservas</span>
              </a>
            </li>
            <li>
              <a routerLink="/client/profile" routerLinkActive="active">
                <fa-icon [icon]="faUser"></fa-icon>
                <span>Mi Perfil</span>
              </a>
            </li>
            <li>
              <a routerLink="/client/create-hotel" routerLinkActive="active">
                <fa-icon [icon]="faHotel"></fa-icon>
                <span>Crear Mi Hotel</span>
              </a>
            </li>
          </ng-container>
          
          <!-- Menú para administradores de hotel -->
          <ng-container *ngIf="isHotelAdmin">
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
          
          <!-- Menú adicional para administradores del sistema -->
          <ng-container *ngIf="isAdmin">
            <li *ngIf="!isHotelAdmin">
              <a routerLink="/admin/dashboard" routerLinkActive="active">
                <fa-icon [icon]="faTachometerAlt"></fa-icon>
                <span>Dashboard</span>
              </a>
            </li>
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
      </nav>
      <div class="sidebar-footer" *ngIf="isAuthenticated">
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
      background-color: #ffffff;
      color:#0d6efd
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
            
            fa-icon {
              margin-right: 0.75rem;
              width: 20px;
              text-align: center;
            }
            
            &:hover, &.active {
              color: #0d6efd;
              background-color: rgba(95, 92, 92, 0.1);
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
        background-color: rgb(255, 0, 0);
        color:rgb(255, 255, 255);
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.2s;
        
        fa-icon {
          margin-right: 0.5rem;
        }
        
        &:hover {
          background-color: rgb(255, 255, 255);
          color: rgb(255, 0, 0);
        }
      }
    }
  `]
})
export class SidebarComponent implements OnInit {
  isAuthenticated: boolean = false;
  isAdmin: boolean = false;
  isHotelAdmin: boolean = false;
  isClient: boolean = false;
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
  faHome = faHome;
  faSearch = faSearch;
  faBookmark = faBookmark;
  faUser = faUser;
  faSignInAlt = faSignInAlt;
  faUserPlus = faUserPlus;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.checkAuthStatus();
    
    // Suscribirse a cambios en el estado de autenticación
    this.authService.currentUser$.subscribe(() => {
      this.checkAuthStatus();
    });
  }
  
  private checkAuthStatus(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    
    if (this.isAuthenticated) {
      const userRole = this.authService.getUserRoleFromToken();
      
      this.isAdmin = userRole === 'admin';
      this.isHotelAdmin = userRole === 'hotel_admin';
      this.isClient = userRole === 'client';
      
      if (this.isAdmin) {
        this.userRoleDisplay = 'Administrador del Sistema';
      } else if (this.isHotelAdmin) {
        this.userRoleDisplay = 'Administrador de Hotel';
      } else if (this.isClient) {
        this.userRoleDisplay = 'Cliente';
      } else {
        this.userRoleDisplay = 'Usuario';
      }
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}

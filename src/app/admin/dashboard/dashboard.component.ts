import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBed, faSignInAlt, faDollarSign, faChartLine, faBell } from '@fortawesome/free-solid-svg-icons';
import { NotificationSimulatorService } from '../../services/notification-simulator.service';
import { DashboardService } from '../../services/dashboard.service';
import { DashboardStats } from '../../models/dashboard.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [DashboardService] // Aseguramos que DashboardService esté disponible
})
export class DashboardComponent implements OnInit {
  // Iconos de FontAwesome
  faBed = faBed;
  faSignInAlt = faSignInAlt;
  faDollarSign = faDollarSign;
  faChartLine = faChartLine;
  faBell = faBell;

  // Estado de la simulación de notificaciones
  notificationsActive = false;

  today = new Date();  
  stats: DashboardStats = {
    totalRooms: 0,
    occupiedRooms: 0,
    availableRooms: 0,
    maintenanceRooms: 0,
    todayCheckIns: 0,
    todayCheckOuts: 0,
    monthlyRevenue: 0,
    occupancyRate: 0
  };
  
  private subscription: Subscription = new Subscription();
  
  constructor(
    private notificationSimulator: NotificationSimulatorService,
    private dashboardService: DashboardService
  ) { }
  ngOnInit(): void {
    // Comprobar si la simulación de notificaciones ya está activa
    this.notificationsActive = this.notificationSimulator.isSimulationActive();
    
    // Cargar datos del dashboard
    this.loadDashboardData();
    
    // Programar actualización de datos cada 5 minutos
    const refreshInterval = setInterval(() => this.loadDashboardData(), 300000);
    
    // Guardar referencia al intervalo para limpiarlo al destruir el componente
    this.subscription.add(() => clearInterval(refreshInterval));
  }
  
  ngOnDestroy(): void {
    // Cancelar todas las suscripciones para evitar memory leaks
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  
  /**
   * Carga los datos para el dashboard desde el backend
   */  loadDashboardData(): void {
    console.log('Iniciando carga de datos del dashboard');
    if (!this.dashboardService) {
      console.error('dashboardService es undefined!');
      return;
    }
    
    try {
      this.subscription.add(
        this.dashboardService.getDashboardStats().subscribe({
          next: (data) => {
            console.log('Datos del dashboard recibidos:', data);
            this.stats = data;
          },
          error: (error) => {
            console.error('Error al cargar datos del dashboard:', error);
            // Podríamos mostrar un mensaje de error al usuario aquí
          }
        })
      );
    } catch (err) {
      console.error('Excepción al intentar cargar datos del dashboard:', err);
    }
  }

  toggleNotificationSimulation(): void {
    if (this.notificationsActive) {
      this.notificationSimulator.stopSimulation();
    } else {
      this.notificationSimulator.startSimulation();
    }
    this.notificationsActive = this.notificationSimulator.isSimulationActive();
  }

  getOccupancyColor(rate: number): string {
    if (rate >= 80) return 'success';
    if (rate >= 60) return 'warning';
    return 'danger';
  }
}

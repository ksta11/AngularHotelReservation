import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faChartBar, faCalendarAlt, faDownload, faFilter, 
  faSearch, faWarning, faPlus 
} from '@fortawesome/free-solid-svg-icons';
import { Report, ReportService } from '../../services/report.service';
import { HotelService } from '../../services/hotel.service';
import { CreateReportModalComponent } from './create-report-modal/create-report-modal.component';

interface ReportData {
  id: string;
  type: 'occupancy' | 'revenue' | 'reservation' | 'reviews' | 'bookings';
  title: string;
  period: string;
  data: any;
  createdAt: string;
  pdfUrl: string;
}

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule, CreateReportModalComponent]
})
export class ReportsComponent implements OnInit {
  reports: ReportData[] = [];
  filteredReports: ReportData[] = [];
  searchTerm: string = '';
  selectedType: string = 'all';
  selectedPeriod: string = 'all';
  hotelId: string | null = null;
  loading: boolean = false;
  error: string | null = null;
    // Iconos
  faChartBar = faChartBar;
  faCalendarAlt = faCalendarAlt;
  faDownload = faDownload;
  faFilter = faFilter;
  faSearch = faSearch;
  faWarning = faWarning;
  faPlus = faPlus;
  
  // Modal de creación de reportes
  showCreateModal = false;

  constructor(
    private reportService: ReportService,
    private hotelService: HotelService
  ) {}
  ngOnInit(): void {
    // Recuperar el ID del hotel desde el almacenamiento
    this.hotelId = this.hotelService.getHotelIdFromStorage();
    if (this.hotelId) {
      this.loadReports();
    } else {
      this.error = 'No se ha encontrado un hotel asociado a tu cuenta';
    }
  }

  loadReports(): void {
    if (!this.hotelId) return;
    
    this.loading = true;
    this.error = null;
    
    this.reportService.getReportsForHotel(this.hotelId)
      .subscribe({
        next: (apiReports) => {
          // Mapear los reportes de la API a nuestro formato
          this.reports = apiReports.map(report => this.mapApiReportToReportData(report));
          this.applyFilters();
          this.loading = false;
        },
        error: (err) => {
          console.error('Error al cargar reportes:', err);
          this.error = typeof err === 'string' ? err : 'Error al cargar los reportes';
          this.loading = false;
          this.reports = [];
          this.filteredReports = [];
        }
      });
  }
  
  mapApiReportToReportData(apiReport: any): ReportData {
    // Datos básicos que todos los reportes tendrán
    const baseReportData: ReportData = {
      id: apiReport.id,
      type: apiReport.type,
      title: this.getReportTitle(apiReport.type),
      period: this.formatPeriod(apiReport.generalData.startDate, apiReport.generalData.endDate),
      createdAt: apiReport.createdAt,
      pdfUrl: apiReport.pdfUrl,
      data: {} // Este objeto se llenará según el tipo
    };
    
    // Dependiendo del tipo de reporte, llenar datos específicos
    switch (apiReport.type) {
      case 'occupancy':
        baseReportData.data = {
          totalRooms: apiReport.totalRooms,
          occupiedRooms: apiReport.occupiedRooms,
          occupancyRate: apiReport.occupancyRate,
          averageStay: apiReport.averageStay
        };
        break;
        
      case 'revenue':
        baseReportData.data = {
          totalRevenue: apiReport.totalRevenue,
          averageRevenue: apiReport.averageRevenue,
          // Simulamos la distribución por tipo de habitación ya que no viene en el API
          revenueByRoom: {
            standard: apiReport.totalRevenue * 0.4, // 40% en habitaciones estándar
            deluxe: apiReport.totalRevenue * 0.6    // 60% en habitaciones deluxe
          }
        };
        break;
        
      case 'reservation':
        baseReportData.data = {
          totalBookings: apiReport.totalReservations,
          newBookings: apiReport.confirmedReservations,
          cancellations: apiReport.cancelledReservations,
          conversionRate: Math.round((apiReport.confirmedReservations / apiReport.totalReservations) * 100)
        };
        break;
    }
    
    return baseReportData;
  }
  
  getReportTitle(type: string): string {
    switch (type) {
      case 'occupancy': return 'Reporte de Ocupación';
      case 'revenue': return 'Reporte de Ingresos';
      case 'reservation': return 'Reporte de Reservas';
      case 'reviews': return 'Reporte de Reseñas';
      default: return 'Reporte';
    }
  }
  
  formatPeriod(startDate: string, endDate: string): string {
    // Convertir a objetos Date
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Si son el mismo mes del mismo año
    if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
      const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                          'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
      return `${monthNames[start.getMonth()]} ${start.getFullYear()}`;
    }
    
    // Si son diferentes
    return `${start.toLocaleDateString('es-ES')} - ${end.toLocaleDateString('es-ES')}`;
  }
  applyFilters(): void {
    this.filteredReports = this.reports.filter(report => {
      const matchesSearch = report.title.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesType = this.selectedType === 'all' || report.type === this.selectedType;
      const matchesPeriod = this.selectedPeriod === 'all' || report.period === this.selectedPeriod;
      
      return matchesSearch && matchesType && matchesPeriod;
    });
  }

  downloadReport(report: ReportData): void {
    if (report.pdfUrl) {
      // Abrir el PDF en una nueva pestaña
      window.open(report.pdfUrl, '_blank');
    } else {
      console.error('No hay URL de PDF disponible para el reporte:', report);
      // Podríamos mostrar una alerta al usuario
      alert('El PDF del reporte no está disponible en este momento.');
    }
  }

  getReportIcon(type: string): string {
    switch (type) {
      case 'occupancy':
        return 'bed';
      case 'revenue':
        return 'dollar-sign';
      case 'reviews':
        return 'star';
      case 'bookings':
        return 'calendar-check';
      default:
        return 'chart-bar';
    }
  }
  getReportClass(type: string): string {
    switch (type) {
      case 'occupancy':
        return 'occupancy';
      case 'revenue':
        return 'revenue';
      case 'reviews':
        return 'reviews';
      case 'bookings':
      case 'reservation': // Usamos la misma clase para 'reservation' que para 'bookings'
        return 'bookings';
      default:
        return '';
    }
  }

  formatNumber(value: number): string {
    return value.toLocaleString('es-ES');
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(value);
  }

  openCreateModal(): void {
    this.showCreateModal = true;
  }
  
  closeCreateModal(): void {
    this.showCreateModal = false;
  }
  
  handleReportCreated(report: any): void {
    console.log('Reporte creado:', report);
    // Recargar la lista de reportes para incluir el nuevo
    this.loadReports();
    // Mostrar notificación de éxito
    this.showNotification('Reporte generado correctamente');
  }
  
  showNotification(message: string): void {
    // Podríamos implementar un sistema de notificaciones más elaborado
    // pero por ahora usaremos un simple alert
    alert(message);
  }
}

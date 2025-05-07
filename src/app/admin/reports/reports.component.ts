import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChartBar, faCalendarAlt, faDownload, faFilter, faSearch } from '@fortawesome/free-solid-svg-icons';

interface ReportData {
  id: number;
  type: 'occupancy' | 'revenue' | 'reviews' | 'bookings';
  title: string;
  period: string;
  data: any;
  createdAt: Date;
}

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule]
})
export class ReportsComponent implements OnInit {
  reports: ReportData[] = [];
  filteredReports: ReportData[] = [];
  searchTerm: string = '';
  selectedType: string = 'all';
  selectedPeriod: string = 'all';
  faChartBar = faChartBar;
  faCalendarAlt = faCalendarAlt;
  faDownload = faDownload;
  faFilter = faFilter;
  faSearch = faSearch;

  constructor() {}

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    // Simulación de datos - En producción esto vendría de un servicio
    this.reports = [
      {
        id: 1,
        type: 'occupancy',
        title: 'Reporte de Ocupación',
        period: 'Marzo 2024',
        data: {
          totalRooms: 50,
          occupiedRooms: 35,
          occupancyRate: 70,
          averageStay: 3.5
        },
        createdAt: new Date('2024-03-20')
      },
      {
        id: 2,
        type: 'revenue',
        title: 'Reporte de Ingresos',
        period: 'Marzo 2024',
        data: {
          totalRevenue: 25000,
          averageRevenue: 500,
          revenueByRoom: {
            standard: 10000,
            deluxe: 15000
          }
        },
        createdAt: new Date('2024-03-20')
      },
      {
        id: 3,
        type: 'reviews',
        title: 'Reporte de Reseñas',
        period: 'Marzo 2024',
        data: {
          totalReviews: 45,
          averageRating: 4.5,
          ratingDistribution: {
            five: 25,
            four: 15,
            three: 3,
            two: 1,
            one: 1
          }
        },
        createdAt: new Date('2024-03-20')
      }
    ];
    this.applyFilters();
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
    // En producción, esto generaría y descargaría un archivo PDF o Excel
    console.log('Descargando reporte:', report);
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
}

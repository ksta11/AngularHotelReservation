import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBed, faSignInAlt, faDollarSign, faChartLine } from '@fortawesome/free-solid-svg-icons';

interface DashboardStats {
  totalRooms: number;
  occupiedRooms: number;
  availableRooms: number;
  maintenanceRooms: number;
  todayCheckIns: number;
  todayCheckOuts: number;
  monthlyRevenue: number;
  occupancyRate: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  // Iconos de FontAwesome
  faBed = faBed;
  faSignInAlt = faSignInAlt;
  faDollarSign = faDollarSign;
  faChartLine = faChartLine;

  today = new Date();
  
  stats: DashboardStats = {
    totalRooms: 50,
    occupiedRooms: 35,
    availableRooms: 12,
    maintenanceRooms: 3,
    todayCheckIns: 8,
    todayCheckOuts: 5,
    monthlyRevenue: 25000,
    occupancyRate: 70
  };

  recentReservations = [
    {
      id: 1,
      guestName: 'Juan Pérez',
      roomNumber: '101',
      checkIn: '2024-03-20',
      checkOut: '2024-03-25',
      status: 'Confirmada'
    },
    {
      id: 2,
      guestName: 'María García',
      roomNumber: '203',
      checkIn: '2024-03-21',
      checkOut: '2024-03-23',
      status: 'Pendiente'
    },
    {
      id: 3,
      guestName: 'Carlos López',
      roomNumber: '305',
      checkIn: '2024-03-22',
      checkOut: '2024-03-24',
      status: 'Confirmada'
    }
  ];

  constructor() { }

  ngOnInit(): void {
    // Aquí cargaríamos los datos reales desde el servicio
  }

  getOccupancyColor(rate: number): string {
    if (rate >= 80) return 'success';
    if (rate >= 60) return 'warning';
    return 'danger';
  }
}

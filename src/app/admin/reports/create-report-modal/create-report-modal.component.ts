import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportService, CreateReportRequest, Report } from '../../../services/report.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCalendarAlt, faFilePdf, faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-create-report-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  template: `
  <div class="modal-overlay" *ngIf="showModal" (click)="onClose()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>Crear Nuevo Reporte</h2>          <button class="close-btn" (click)="onClose()">
            <fa-icon [icon]="faTimes"></fa-icon>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="form-group">
            <label for="reportType">Tipo de Reporte</label>
            <select id="reportType" [(ngModel)]="reportType" class="form-select">
              <option value="occupancy">Reporte de Ocupación</option>
              <option value="revenue">Reporte de Ingresos</option>
              <option value="reservation">Reporte de Reservaciones</option>
            </select>
          </div>
          
          <div class="date-range">
            <div class="form-group">
              <label for="startDate">Fecha de Inicio</label>
              <div class="date-input-container">
                <input 
                  type="date" 
                  id="startDate" 
                  [(ngModel)]="startDate" 
                  class="form-control"
                  [max]="endDate || today"
                >
                <fa-icon [icon]="faCalendarAlt"></fa-icon>
              </div>
            </div>
            
            <div class="form-group">
              <label for="endDate">Fecha de Fin</label>
              <div class="date-input-container">
                <input 
                  type="date" 
                  id="endDate" 
                  [(ngModel)]="endDate" 
                  class="form-control"
                  [min]="startDate"
                  [max]="today"
                >
                <fa-icon [icon]="faCalendarAlt"></fa-icon>
              </div>
            </div>
          </div>
          
          <div *ngIf="error" class="error-message">
            {{ error }}
          </div>
        </div>
        
        <div class="modal-footer">          <button 
            class="btn btn-secondary" 
            (click)="onClose()"
            [disabled]="isLoading"
          >
            Cancelar
          </button>
          <button 
            class="btn btn-primary" 
            (click)="createReport()"
            [disabled]="!isFormValid() || isLoading"
          >
            <span *ngIf="isLoading" class="spinner-border spinner-border-sm me-2"></span>
            <fa-icon [icon]="faFilePdf" *ngIf="!isLoading"></fa-icon>
            Generar Reporte
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
    
    .modal-content {
      background-color: white;
      border-radius: 8px;
      width: 90%;
      max-width: 500px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      animation: slideDown 0.3s forwards;
    }
    
    @keyframes slideDown {
      from {
        transform: translateY(-50px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
    
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      border-bottom: 1px solid #e9ecef;
    }
    
    .modal-header h2 {
      margin: 0;
      font-size: 1.5rem;
      color: #343a40;
    }
    
    .close-btn {
      background: none;
      border: none;
      font-size: 1.25rem;
      color: #6c757d;
      cursor: pointer;
      transition: color 0.2s;
    }
    
    .close-btn:hover {
      color: #dc3545;
    }
    
    .modal-body {
      padding: 1rem;
    }
    
    .form-group {
      margin-bottom: 1rem;
    }
    
    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #495057;
    }
    
    .form-select,
    .form-control {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ced4da;
      border-radius: 4px;
      font-size: 1rem;
    }
    
    .date-range {
      display: flex;
      gap: 1rem;
    }
    
    .date-range .form-group {
      flex: 1;
    }
    
    .date-input-container {
      position: relative;
    }
    
    .date-input-container fa-icon {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      color: #6c757d;
      pointer-events: none;
    }
    
    .modal-footer {
      padding: 1rem;
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
      border-top: 1px solid #e9ecef;
    }
    
    .btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }
    
    .btn-secondary:hover {
      background-color: #5a6268;
    }
    
    .btn-primary {
      background-color: #007bff;
      color: white;
    }
    
    .btn-primary:hover:not(:disabled) {
      background-color: #0069d9;
    }
    
    .btn:disabled {
      opacity: 0.65;
      cursor: not-allowed;
    }
    
    .error-message {
      background-color: #f8d7da;
      color: #721c24;
      padding: 0.75rem;
      border-radius: 4px;
      margin-top: 1rem;
    }
  `]
})
export class CreateReportModalComponent implements OnInit {
  @Input() hotelId: string | null = null;
  @Input() showModal = false;
  @Output() close = new EventEmitter<void>();
  @Output() reportCreated = new EventEmitter<Report>();
  
  reportType: string = 'occupancy';
  startDate: string = '';
  endDate: string = '';
  today: string = '';
  isLoading = false;
  error: string | null = null;
  
  // Icons
  faCalendarAlt = faCalendarAlt;
  faFilePdf = faFilePdf;
  faTimes = faTimes;
  
  constructor(private reportService: ReportService) {}
  
  ngOnInit(): void {
    // Establecer fecha actual como el valor predeterminado para la fecha de fin
    const now = new Date();
    this.today = this.formatDate(now);
    this.endDate = this.today;
    
    // Establecer fecha de inicio predeterminada (30 días atrás)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    this.startDate = this.formatDate(thirtyDaysAgo);
  }
  
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  onClose(): void {
    this.close.emit();
  }
  
  isFormValid(): boolean {
    return !!this.reportType && !!this.startDate && !!this.endDate;
  }
  createReport(): void {
    if (!this.hotelId || !this.isFormValid()) return;
    
    this.isLoading = true;
    this.error = null;
    
    const reportData: CreateReportRequest = {
      startDate: this.startDate,
      endDate: this.endDate
    };
    
    let reportObservable;
    
    switch (this.reportType) {
      case 'occupancy':
        this.reportService.createOccupancyReport(this.hotelId, reportData).subscribe({
          next: (report) => {
            this.handleReportSuccess(report);
          },
          error: (err) => {
            this.handleReportError(err);
          }
        });
        break;
      case 'revenue':
        this.reportService.createRevenueReport(this.hotelId, reportData).subscribe({
          next: (report) => {
            this.handleReportSuccess(report);
          },
          error: (err) => {
            this.handleReportError(err);
          }
        });
        break;
      case 'reservation':
        this.reportService.createReservationReport(this.hotelId, reportData).subscribe({
          next: (report) => {
            this.handleReportSuccess(report);
          },
          error: (err) => {
            this.handleReportError(err);
          }
        });
        break;
      default:
        this.isLoading = false;
        this.error = 'Tipo de reporte inválido';
        return;
    }
  }
    private handleReportSuccess(report: Report): void {
    this.isLoading = false;
    this.reportCreated.emit(report);
    this.close.emit();
  }
  
  private handleReportError(err: any): void {
    this.isLoading = false;
    this.error = typeof err === 'string' 
      ? err 
      : 'Error al crear el reporte. Intente nuevamente.';
    console.error('Error al crear reporte:', err);
  }
}

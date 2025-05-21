import { Injectable } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationSimulatorService {
  private notificationInterval: any;
  private simulationActive = false;

  constructor(private notificationService: NotificationService) {}

  // Iniciar la simulación de notificaciones
  startSimulation(): void {
    if (this.simulationActive) return;
    
    this.simulationActive = true;
    this.notificationInterval = setInterval(() => {
      this.simulateRandomNotification();
    }, 45000); // Cada 45 segundos
    
    // Notificación inicial
    setTimeout(() => {
      this.simulateRandomNotification();
    }, 5000);
  }

  // Detener la simulación
  stopSimulation(): void {
    if (this.notificationInterval) {
      clearInterval(this.notificationInterval);
      this.simulationActive = false;
    }
  }

  // Simular una notificación aleatoria
  private simulateRandomNotification(): void {
    const types = ['info', 'success', 'warning', 'error'] as const;
    const events = [
      { message: 'Nueva reserva recibida para la habitación 101', type: 'info' },
      { message: 'Pago confirmado para la reserva #12345', type: 'success' },
      { message: 'Actualización de disponibilidad de habitaciones', type: 'info' },
      { message: 'Cancelación de reserva para la habitación 203', type: 'warning' },
      { message: 'Error en el procesamiento de pago', type: 'error' },
      { message: 'Check-in completado para el huésped María González', type: 'success' },
      { message: 'Check-out programado para mañana (5 habitaciones)', type: 'info' },
      { message: 'Nueva reseña de cliente recibida: 5 estrellas', type: 'success' },
      { message: 'Mantenimiento programado para la habitación 402', type: 'warning' }
    ];

    const randomEvent = events[Math.floor(Math.random() * events.length)];
    this.notificationService.simulateNotification(
      randomEvent.message, 
      randomEvent.type as any
    );
  }

  // Simular una notificación específica (para testing)
  simulateSpecificNotification(message: string, type: 'info' | 'success' | 'warning' | 'error'): void {
    this.notificationService.simulateNotification(message, type);
  }

  // Verificar si la simulación está activa
  isSimulationActive(): boolean {
    return this.simulationActive;
  }
}

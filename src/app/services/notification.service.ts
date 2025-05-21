import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import io from 'socket.io-client';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth/services/auth.service';

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
  link?: string;
  data?: any;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService implements OnDestroy {
  private socket!: ReturnType<typeof io>; // Uso de ! para indicar que se inicializará más tarde
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  private unreadCountSubject = new BehaviorSubject<number>(0);
  public unreadCount$ = this.unreadCountSubject.asObservable();

  private userSubscription!: Subscription;
  constructor(private authService: AuthService) {
    // Suscribirse a cambios en la autenticación para conectar/desconectar socket
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      if (user) {
        // Si hay un usuario autenticado, cargar notificaciones y conectar
        this.loadNotificationsFromStorage();
        this.initializeSocketConnection();
      } else {
        // Si el usuario cierra sesión:
        // 1. Desconectar el socket si existe
        if (this.socket && this.socket.connected) {
          console.log('Usuario desconectado, cerrando socket');
          this.socket.disconnect();
        }
        // 2. Limpiar las notificaciones
        this.clearNotifications();
      }
    });
  }

  private initializeSocketConnection(): void {
    // Verificar si ya hay una conexión activa
    if (this.socket && this.socket.connected) {
      console.log('Socket ya conectado, no se requiere nueva conexión');
      return;
    }

    // Obtener el token de autenticación del localStorage
    const token = localStorage.getItem('accessToken');

    if (!token) {
      console.warn('No hay token de autenticación disponible para Socket.IO');
      return;
    }    // Conectar al servidor de sockets con el token de autenticación
    // Usar la URL base sin el prefijo /api
    const socketUrl = environment.apiUrl.replace('/api', '');
    console.log('Intentando conectar a:', socketUrl);
    
    // Configuración de Socket.IO
    // - Se envía el token en dos formatos:
    //   1. Solo el token en auth.token
    //   2. Con prefijo "Bearer" en extraHeaders.Authorization
    const socketOptions = {
      path: '/socket.io/', // Path específico configurado en el gateway
      transports: ['websocket', 'polling'], // Métodos de transporte permitidos
      auth: {
        token: token  // Solo el token JWT sin el prefijo "Bearer"
      },
      extraHeaders: {
        Authorization: `Bearer ${token}`  // Aquí sí va el prefijo "Bearer"
      },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000
    };
    
    console.log('Opciones de conexión:', JSON.stringify(socketOptions, null, 2));
    this.socket = io(socketUrl, socketOptions);
    this.setupSocketListeners();
  }

  private setupSocketListeners(): void {
    if (!this.socket) {
      console.warn('No se puede configurar listeners: Socket no inicializado');
      return;
    }

    // Manejar eventos de conexión y errores
    this.socket.on('connect', () => {
      console.log('Conectado al servidor de Socket.IO');
    });

    this.socket.on('connection_established', (userData: any) => {
      console.log('Conexión establecida con el servidor. Datos del usuario:', userData);
    });

    this.socket.on('connect_error', (error: Error) => {
      console.error('Error de conexión con Socket.IO:', error);
    });

    this.socket.on('disconnect', (reason: string) => {
      console.warn('Desconectado del servidor Socket.IO. Razón:', reason);
    });

    // Escuchar eventos de nuevas notificaciones
    this.socket.on('notification', (notification: Notification) => {
      this.addNotification(notification);
    });

    // Escuchar eventos de reservas
    this.socket.on('reservation-created', (data: any) => {
      this.addNotification({
        id: `reservation-${Date.now()}`,
        message: `Nueva reserva creada para ${data.guestName}`,
        type: 'info',
        timestamp: new Date(),
        read: false,
        data: data
      });
    });

    this.socket.on('reservation-updated', (data: any) => {
      this.addNotification({
        id: `reservation-update-${Date.now()}`,
        message: `Reserva actualizada: ${data.guestName}`,
        type: 'info',
        timestamp: new Date(),
        read: false,
        data: data
      });
    });

    this.socket.on('reservation-cancelled', (data: any) => {
      this.addNotification({
        id: `reservation-cancel-${Date.now()}`,
        message: `Reserva cancelada: ${data.guestName}`,
        type: 'warning',
        timestamp: new Date(),
        read: false,
        data: data
      });
    });
  }
  private loadNotificationsFromStorage(): void {
    // Solo cargar notificaciones si hay un usuario autenticado
    if (!this.isUserAuthenticated()) {
      console.log('No hay usuario autenticado, no se cargarán las notificaciones');
      return;
    }

    const storedNotifications = localStorage.getItem('notifications');
    if (storedNotifications) {
      try {
        const parsedNotifications = JSON.parse(storedNotifications) as Notification[];
        // Convertir las fechas string a objetos Date
        const notificationsWithDates = parsedNotifications.map(n => ({
          ...n,
          timestamp: new Date(n.timestamp)
        }));
        this.notificationsSubject.next(notificationsWithDates);
        this.updateUnreadCount();
      } catch (e) {
        console.error('Error parsing stored notifications', e);
        this.notificationsSubject.next([]);
      }
    }
  }
  private saveNotificationsToStorage(): void {
    // Solo guardar notificaciones si hay un usuario autenticado
    if (!this.isUserAuthenticated()) {
      console.log('No hay usuario autenticado, no se guardarán las notificaciones');
      return;
    }
    localStorage.setItem('notifications', JSON.stringify(this.notificationsSubject.value));
  }

  private addNotification(notification: Notification): void {
    const currentNotifications = this.notificationsSubject.value;
    const updatedNotifications = [notification, ...currentNotifications].slice(0, 100); // Limitar a 100 notificaciones
    this.notificationsSubject.next(updatedNotifications);
    this.saveNotificationsToStorage();
    this.updateUnreadCount();
  }

  private updateUnreadCount(): void {
    const unreadCount = this.notificationsSubject.value.filter(n => !n.read).length;
    this.unreadCountSubject.next(unreadCount);
  }

  public markAsRead(id: string): void {
    const currentNotifications = this.notificationsSubject.value;
    const updatedNotifications = currentNotifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    );
    this.notificationsSubject.next(updatedNotifications);
    this.saveNotificationsToStorage();
    this.updateUnreadCount();
  }

  public markAllAsRead(): void {
    const currentNotifications = this.notificationsSubject.value;
    const updatedNotifications = currentNotifications.map(n => ({ ...n, read: true }));
    this.notificationsSubject.next(updatedNotifications);
    this.saveNotificationsToStorage();
    this.updateUnreadCount();
  }
  public clearNotifications(): void {
    this.notificationsSubject.next([]);
    localStorage.removeItem('notifications'); // Eliminar directamente del localStorage
    this.updateUnreadCount();
  }

  public deleteNotification(id: string): void {
    const currentNotifications = this.notificationsSubject.value;
    const updatedNotifications = currentNotifications.filter(n => n.id !== id);
    this.notificationsSubject.next(updatedNotifications);
    this.saveNotificationsToStorage();
    this.updateUnreadCount();
  }
  // Método para simular una notificación (útil para testing)
  public simulateNotification(message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info'): void {
    if (!this.isUserAuthenticated()) {
      console.warn('No se puede simular notificación: No hay usuario autenticado');
      return;
    }

    this.addNotification({
      id: `manual-${Date.now()}`,
      message,
      type,
      timestamp: new Date(),
      read: false
    });
  }

  // Método para verificar si hay un usuario autenticado
  private isUserAuthenticated(): boolean {
    const token = localStorage.getItem('accessToken');
    return !!token;
  }

  // Método público para reconectar manualmente el socket
  public reconnectSocket(): void {
    if (!this.isUserAuthenticated()) {
      console.warn('No se puede reconectar: No hay usuario autenticado');
      return;
    }

    if (this.socket) {
      this.socket.disconnect();
    }
    this.initializeSocketConnection();
  }

  // Método público para verificar el estado de la conexión
  public isSocketConnected(): boolean {
    return this.socket?.connected || false;
  }

  ngOnDestroy(): void {
    // Limpiar suscripciones y desconectar el socket al destruir el servicio
    if (this.socket) {
      this.socket.disconnect();
    }
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}

import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { User, LoginResponse, AuthError } from '../interfaces/user.interface';
import { jwtDecode } from 'jwt-decode'; // Asegúrate de instalar este paquete: npm install jwt-decode
import { isPlatformBrowser } from '@angular/common';

// URL de la API
const API_URL = 'http://localhost:3000/api';

interface JwtPayload {
  id: string;
  email: string;
  role?: 'admin' | 'client' | 'hotel_admin';
  iat: number;
  exp: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    
    // Verificar si hay token en localStorage al iniciar (solo en el navegador)
    if (this.isBrowser) {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          // Decodificar el token para obtener la información del usuario
          const decoded = jwtDecode<JwtPayload>(token);
          const user: User = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role
          };
          this.currentUserSubject.next(user);
        } catch (error) {
          console.error('Error decoding token:', error);
          if (this.isBrowser) {
            localStorage.removeItem('accessToken');
          }
        }
      }
    }
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${API_URL}/auth/login`, { email, password })
      .pipe(
        tap(response => {
          if (this.isBrowser) {
            // Guardar token en localStorage (solo en el navegador)
            localStorage.setItem('accessToken', response.accessToken);
          }
            
          // Decodificar el token para obtener la información del usuario
          const decoded = jwtDecode<JwtPayload>(response.accessToken);
          const user: User = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role
          };
          
          // Actualizar el BehaviorSubject
          this.currentUserSubject.next(user);
        }),
        catchError(this.handleError)
      );
  }

  register(user: Omit<User, 'id' | 'role'>): Observable<LoginResponse> {
    // Asegurarnos de que usamos passwordHash en lugar de password en la petición
    const requestBody = {
      email: user.email,
      passwordHash: user.password || user.passwordHash, // Utilizamos lo que esté disponible
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone
    };
    
    return this.http.post<LoginResponse>(`${API_URL}/auth/register`, requestBody)
      .pipe(
        tap(response => {
          if (this.isBrowser) {
            // Guardar token en localStorage (solo en el navegador)
            localStorage.setItem('accessToken', response.accessToken);
          }
          
          // Decodificar el token para obtener la información del usuario
          const decoded = jwtDecode<JwtPayload>(response.accessToken);
          const newUser: User = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role
          };
          
          // Actualizar el BehaviorSubject
          this.currentUserSubject.next(newUser);
        }),
        catchError(this.handleError)
      );
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('accessToken');
    }
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    if (!this.isBrowser) {
      return false; // En el servidor siempre devolver false
    }
    
    const token = localStorage.getItem('accessToken');
    if (!token) return false;
    
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      // Verificar si el token ha expirado
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch {
      return false;
    }
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
  
  getToken(): string | null {
    if (!this.isBrowser) {
      return null;
    }
    return localStorage.getItem('accessToken');
  }
  
  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error devuelto por el backend
      const serverError = error.error as AuthError;
      errorMessage = serverError.message || `Código de error: ${error.status}, mensaje: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => errorMessage);
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, LoginResponse } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Removemos la verificación de autenticación para desarrollo
  }

  login(email: string, password: string): Observable<LoginResponse> {
    // TODO: Implementar la llamada al backend cuando esté listo
    // Por ahora, simulamos una respuesta exitosa
    return new Observable(observer => {
      const mockResponse: LoginResponse = {
        token: 'mock-token',
        user: {
          id: 1,
          email: email,
          name: 'Usuario de Prueba',
          role: 'client',
          password: password
        }
      };
      
      // Guardar en localStorage
      localStorage.setItem('currentUser', JSON.stringify(mockResponse.user));
      localStorage.setItem('token', mockResponse.token);
      
      // Actualizar el BehaviorSubject
      this.currentUserSubject.next(mockResponse.user);
      
      observer.next(mockResponse);
      observer.complete();
    });
  }

  register(user: User): Observable<User> {
    // TODO: Implementar la llamada al backend cuando esté listo
    return new Observable(observer => {
      observer.next(user);
      observer.complete();
    });
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return false; // Siempre retornamos false para desarrollo
  }

  getCurrentUser(): User | null {
    return null; // Siempre retornamos null para desarrollo
  }
}

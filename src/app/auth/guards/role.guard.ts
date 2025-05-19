import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  
  constructor(private authService: AuthService, private router: Router) {}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // Verificar si el usuario está autenticado
    if (!this.authService.isAuthenticated()) {
      return this.router.createUrlTree(['/auth/login']);
    }
    
    // Obtener los roles permitidos de los datos de la ruta
    const allowedRoles = route.data['roles'] as string[];
    
    // Obtener el rol del usuario actual
    const userRole = this.authService.getUserRoleFromToken();
    
    // Verificar si el rol del usuario está dentro de los roles permitidos
    if (userRole && allowedRoles.includes(userRole)) {
      return true;
    }
    
    // Si el rol no está permitido, redirigir a una página de acceso denegado o dashboard
    return this.router.createUrlTree(['/access-denied']);
  }
}

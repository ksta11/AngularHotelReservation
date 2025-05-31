import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();
  
  // Lista de rutas que no requieren autenticación
  const publicRoutes = ['/auth/login', '/auth/register', '/client/available-rooms'];
  
  // Obtener la ruta actual del router
  const currentRoute = router.url;
  
  // Verificar si la ruta actual es pública
  const isPublicRoute = publicRoutes.some(route => currentRoute === route);
  
  // Verificar si la ruta es de administración
  const isAdminRoute = currentRoute.startsWith('/admin');
  
  // Verificar si la ruta es del cliente
  const isClientRoute = currentRoute.startsWith('/client');
  
  if (!token && !isPublicRoute && !isClientRoute) {
    // Si no hay token y la ruta no es pública ni del cliente, redirigir al login
    router.navigate(['/auth/login']);
    return next(req);
  }
    if (token) {
    // Verificar si el usuario tiene el rol correcto para rutas de administración
    if (isAdminRoute) {
      const userRole = authService.getUserRoleFromToken();
      if (userRole !== 'admin' && userRole !== 'hotel_admin') {
        router.navigate(['/auth/login']);
        return next(req);
      }
    }
    
    // Comprobar si la solicitud va a Cloudinary
    if (req.url.includes('api.cloudinary.com')) {
      // No añadir token para las solicitudes a Cloudinary
      return next(req);
    }
    
    // Clonar la solicitud y agregar el token de autorización para otras solicitudes
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(authReq);
  }
  
  return next(req);
};

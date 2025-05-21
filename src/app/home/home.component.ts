import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faSearch, 
  faCalendarCheck, 
  faUserClock, 
  faHeadset,
  faStar,
  faQuoteLeft,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  // Iconos
  faSearch = faSearch;
  faCalendarCheck = faCalendarCheck;
  faUserClock = faUserClock;
  faHeadset = faHeadset;
  faStar = faStar;
  faQuoteLeft = faQuoteLeft;
  faArrowRight = faArrowRight;

  // Constructor para Math
  Math = Math;

  // Hoteles destacados
  featuredHotels = [
    {
      name: 'Hotel Luxury Resort',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80',
      rating: 4.8,
      description: 'Un paraíso de lujo con vistas al mar'
    },
    {
      name: 'City Center Hotel',
      image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80',
      rating: 4.5,
      description: 'Ubicación perfecta en el corazón de la ciudad'
    },
    {
      name: 'Mountain View Lodge',
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1080&q=80',
      rating: 4.7,
      description: 'Escape a la naturaleza con todas las comodidades'
    }
  ];

  // Testimonios
  testimonials = [
    {
      name: 'María González',
      comment: 'Excelente servicio y facilidad para hacer reservas. ¡Altamente recomendado!',
      rating: 5
    },
    {
      name: 'Juan Pérez',
      comment: 'La mejor plataforma para encontrar hoteles. Muy intuitiva y rápida.',
      rating: 5
    },
    {
      name: 'Ana Martínez',
      comment: 'Increíble experiencia. El proceso de reserva fue muy sencillo.',
      rating: 4
    }
  ];
}

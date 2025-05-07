import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faStar, faSearch, faReply, faTrash, faFilter } from '@fortawesome/free-solid-svg-icons';

interface Review {
  id: number;
  guestName: string;
  roomNumber: string;
  rating: number;
  comment: string;
  date: Date;
  status: 'pending' | 'approved' | 'rejected';
  response?: string;
}

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, FontAwesomeModule],
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent implements OnInit {
  reviews: Review[] = [];
  filteredReviews: Review[] = [];
  selectedFilter: string = 'all';
  searchTerm: string = '';
  selectedRating: number = 0;

  // Icons
  faStar = faStar;
  faSearch = faSearch;
  faReply = faReply;
  faTrash = faTrash;
  faFilter = faFilter;

  constructor() {}

  ngOnInit(): void {
    // Simulación de datos - En producción esto vendría de un servicio
    this.reviews = [
      {
        id: 1,
        guestName: 'Juan Pérez',
        roomNumber: '101',
        rating: 5,
        comment: 'Excelente servicio y habitación muy cómoda. Volveré pronto.',
        date: new Date(),
        status: 'approved',
        response: '¡Gracias por su excelente reseña! Esperamos verlo pronto.'
      },
      {
        id: 2,
        guestName: 'María García',
        roomNumber: '203',
        rating: 4,
        comment: 'Muy buena estancia, solo faltó un poco más de limpieza en el baño.',
        date: new Date(Date.now() - 86400000),
        status: 'pending'
      },
      {
        id: 3,
        guestName: 'Carlos López',
        roomNumber: '305',
        rating: 2,
        comment: 'El servicio fue muy lento y la habitación no estaba lista a la hora acordada.',
        date: new Date(Date.now() - 172800000),
        status: 'rejected',
        response: 'Lamentamos mucho su experiencia. Hemos tomado medidas para mejorar nuestro servicio.'
      }
    ];
    this.filteredReviews = [...this.reviews];
  }

  filterReviews(): void {
    this.filteredReviews = this.reviews.filter(review => {
      const matchesFilter = this.selectedFilter === 'all' || 
                          review.status === this.selectedFilter;
      const matchesSearch = !this.searchTerm || 
                          review.guestName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                          review.comment.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesRating = this.selectedRating === 0 || 
                          review.rating === this.selectedRating;
      return matchesFilter && matchesSearch && matchesRating;
    });
  }

  approveReview(review: Review): void {
    review.status = 'approved';
  }

  rejectReview(review: Review): void {
    review.status = 'rejected';
  }

  deleteReview(review: Review): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta reseña?')) {
      this.reviews = this.reviews.filter(r => r.id !== review.id);
      this.filterReviews();
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'approved':
        return 'status-approved';
      case 'pending':
        return 'status-pending';
      case 'rejected':
        return 'status-rejected';
      default:
        return '';
    }
  }

  getStars(rating: number): number[] {
    return Array(5).fill(0).map((_, index) => index < rating ? 1 : 0);
  }
}

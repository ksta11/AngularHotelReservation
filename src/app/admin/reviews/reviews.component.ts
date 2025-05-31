import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faStar, faSearch, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Review } from '../../models/review.model';
import { ReviewService } from '../../services/review.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, FontAwesomeModule],
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent implements OnInit, OnDestroy {
  reviews: Review[] = [];
  filteredReviews: Review[] = [];
  searchTerm: string = '';
  selectedRating: number = 0;
  isLoading: boolean = false;
  error: string | null = null;
  isSubmitting: boolean = false;

  // Icons
  faStar = faStar;
  faSearch = faSearch;
  faSpinner = faSpinner;

  private subscription = new Subscription();

  constructor(private reviewService: ReviewService) {}

  ngOnInit(): void {
    this.loadReviews();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadReviews(): void {
    this.isLoading = true;
    this.error = null;

    this.subscription.add(
      this.reviewService.getHotelReviews().subscribe({
        next: (reviews) => {
          this.reviews = reviews;
          this.filterReviews();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error al cargar las reseñas:', error);
          this.error = error?.message || 'No se pudieron cargar las reseñas. Por favor, inténtalo de nuevo más tarde.';
          this.isLoading = false;
        }
      })
    );
  }

  filterReviews(): void {
    this.filteredReviews = this.reviews.filter(review => {
      const matchesSearch = !this.searchTerm || 
                          review.comment.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesRating = this.selectedRating === 0 || 
                          review.rating === this.selectedRating;
      return matchesSearch && matchesRating;
    });
  }

  respondToReview(review: Review, response: string): void {
    if (!response.trim()) {
      alert('La respuesta no puede estar vacía');
      return;
    }

    this.isSubmitting = true;
    
    this.subscription.add(
      this.reviewService.respondToReview(review.id, response).subscribe({
        next: (updatedReview) => {
          const index = this.reviews.findIndex(r => r.id === updatedReview.id);
          if (index !== -1) {
            this.reviews[index] = updatedReview;
            this.filterReviews();
          }
          this.isSubmitting = false;
        },
        error: (error) => {
          console.error('Error al responder la reseña:', error);
          alert(error?.message || 'No se pudo guardar la respuesta. Por favor, inténtalo de nuevo.');
          this.isSubmitting = false;
        }
      })
    );
  }

  getStars(rating: number): number[] {
    return Array(5).fill(0).map((_, index) => index < rating ? 1 : 0);
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

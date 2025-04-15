import { Component, OnInit } from '@angular/core';
import { VetRatingService } from 'src/app/services/vet/rating/vet-rating.service';
import { RatingVet } from 'src/app/models/vet/rating-vet';

@Component({
  selector: 'app-info-rating-vet',
  templateUrl: './info-rating-vet.component.html',
  styleUrls: ['./info-rating-vet.component.css']
})
export class InfoRatingVetComponent implements OnInit {
  ratings: RatingVet[] = [];
  averageRating: number = 0;
  isLoading: boolean = true;

  constructor(private ratingService: VetRatingService) { }

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.loadVetRatings(+userId);
    }
  }

  loadVetRatings(userId: number): void {
    // Charger la note moyenne
    this.ratingService.getAverageRatingForVet(userId).subscribe({
      next: (avg) => {
        this.averageRating = avg;
      },
      error: (err) => console.error(err)
    });

    // Charger les évaluations
    this.ratingService.getRatingsByUserId(userId).subscribe({
      next: (ratings) => {
        this.ratings = ratings;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  getStarArray(rating: number): any[] {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return Array(5).fill(0).map((_, i) => ({
      filled: i < fullStars,
      half: !hasHalfStar ? false : i === fullStars,
      empty: i >= fullStars + (hasHalfStar ? 1 : 0)
    }));
  }

  getRandomColor(): string {
    const colors = [
      '#f83182', '#fe9a7a', '#36a2eb', '#4bc0c0', 
      '#9966ff' , '#f53b7f' ,'#3bf2f5','#f5443b'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

}
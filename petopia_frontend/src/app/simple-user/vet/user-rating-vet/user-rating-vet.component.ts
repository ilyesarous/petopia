import { Component , OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VetRatingService } from 'src/app/services/vet/rating/vet-rating.service';
import { RatingVet } from 'src/app/models/vet/rating-vet';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-rating-vet',
  templateUrl: './user-rating-vet.component.html',
  styleUrls: ['./user-rating-vet.component.css']
})
export class UserRatingVetComponent implements OnInit {
  vetId!: number;
  ratings: RatingVet[] = [];
  averageRating: number = 0;
  newRating: RatingVet = new RatingVet();
  ratingValue: number = 0;
  comment: string = '';

  constructor(private vetRatingService: VetRatingService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Récupérer l'ID du vétérinaire depuis l'URL
    this.vetId = +this.route.snapshot.params['id'];
  }

  addRating(): void {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('Vous devez être connecté pour ajouter une évaluation');
      return;
    }
  
    const newRating: RatingVet = {
      idRating: 0,
      note: this.ratingValue,
      comment: this.comment,
      userclientR: { id_user: +userId },
      uservetR: { id_user: this.vetId }
    };
  
    this.vetRatingService.addRatingVet(newRating).subscribe({
      next: (response) => {
        this.router.navigate(['/vet/qrcode-vet-scanner']); // Redirection après succès
      },
      error: (err) => {
        console.error('Error:', err);
        alert('Erreur lors de l\'ajout du rating');
      }
    });
  }
  
}
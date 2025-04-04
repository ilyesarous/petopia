import { Component } from '@angular/core';
import { StripePaymentService } from 'src/app/services/vet/payment/stripe-payment.service';
import { ActivatedRoute } from '@angular/router';
import { OnInit } from '@angular/core';
import { PetService } from 'src/app/services/pets/pet.service';
import { Pet } from 'src/app/models/pet/Pet';

@Component({
  selector: 'app-dash-principale-user',
  templateUrl: './dash-principale-user.component.html',
  styleUrls: ['./dash-principale-user.component.css']
})
export class DashPrincipaleUserComponent implements OnInit {
  userPets: Pet[] = [];
  loading = true;

  constructor(
    private stripePaymentService: StripePaymentService,
    private route: ActivatedRoute,
    private petService: PetService
  ) {}

  ngOnInit() {
    // Récupérer l'ID de l'utilisateur connecté
    const userId = localStorage.getItem('userId');
    
    if (userId) {
      this.loadUserPets(parseInt(userId));
    }

    this.route.queryParams.subscribe(params => {
      if (params['payment_status'] === 'success') {
        setTimeout(() => {
          this.stripePaymentService.showPaymentStatus('success');
        }, 500);
      } else if (params['payment_status'] === 'cancel') {
        setTimeout(() => {
          this.stripePaymentService.showPaymentStatus('cancel');
        }, 500);
      }
    });
  }

  loadUserPets(userId: number) {
    this.petService.getPetsByOwnerId(userId).subscribe({
      next: (pets) => {
        this.userPets = pets;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading pets:', err);
        this.loading = false;
      }
    });
  }

  handlePaymentClick() {
    this.stripePaymentService.redirectToCheckout();
  }

  redirectToUrlDogBreedRecognition() {
    window.location.href = 'http://localhost:8501';
  }

}

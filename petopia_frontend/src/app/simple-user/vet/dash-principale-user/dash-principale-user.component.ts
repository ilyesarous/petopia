import { Component } from '@angular/core';
import { StripePaymentService } from 'src/app/services/vet/payment/stripe-payment.service';
import { ActivatedRoute } from '@angular/router';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-dash-principale-user',
  templateUrl: './dash-principale-user.component.html',
  styleUrls: ['./dash-principale-user.component.css']
})
export class DashPrincipaleUserComponent implements OnInit {

  constructor(
    private stripePaymentService: StripePaymentService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['payment_status'] === 'success') {
        setTimeout(() => {
          this.stripePaymentService.showPaymentStatus('success');
        }, 500); // Petit délai pour laisser le temps à la page de charger
      } else if (params['payment_status'] === 'cancel') {
        setTimeout(() => {
          this.stripePaymentService.showPaymentStatus('cancel');
        }, 500);
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

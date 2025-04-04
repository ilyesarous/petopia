import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { loadStripe } from '@stripe/stripe-js';
import { MatDialog } from '@angular/material/dialog';
import { PaymentStatusPopupComponent } from 'src/app/simple-user/vet/payment-status-popup/payment-status-popup.component';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class StripePaymentService {

  private apiUrl = 'http://localhost:8082/petopia/auth/api/payment';
  private defaultPaymentDetails = {
    amount: 50,
    description: 'Veterinary services payment'
  };

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private router: Router
  ) { }

  createCheckoutSession(): Observable<any> {
    const paymentRequest = {
      amount: this.defaultPaymentDetails.amount,
      currency: 'tnd',
      type: 'VET',
      description: this.defaultPaymentDetails.description,
      paymentDate: new Date().toISOString(),
      userId: 1
    };
  
    return this.http.post(
      `${this.apiUrl}/create-checkout-session`,
      paymentRequest,
      { 
        headers: new HttpHeaders({'Content-Type': 'application/json'}),
        withCredentials: false
      }
    );
  }

  async redirectToCheckout() {
    try {
      const response: any = await this.createCheckoutSession().toPromise();
      const stripe = await loadStripe('pk_test_51OpFDfKiR2IT5FaSc8l7iJlaZ1MiLvSDyyfqBVO7DbzGr5whXochBfHg0l4ckTwNt5nZhMDi08y2OqKcCjD4J5nP00CUs4zvYR');

      if (stripe) {
        const { error } = await stripe.redirectToCheckout({
          sessionId: response.sessionId
        });

        if (error) {
          console.error('Error redirecting to checkout:', error);
          this.showPaymentStatus('cancel');
        }
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      this.showPaymentStatus('cancel');
    }
  }

  showPaymentStatus(status: 'success' | 'cancel', paymentDetails?: {amount: number, description: string}): void {
    // Utilise les détails fournis ou les valeurs par défaut
    const details = paymentDetails || this.defaultPaymentDetails;
    
    this.router.navigate(['vet/dash-principale-user'], {
      queryParams: { payment_status: status }
    }).then(() => {
      setTimeout(() => {
        this.dialog.open(PaymentStatusPopupComponent, {
          width: '400px',
          data: { 
            status,
            amount: details.amount,
            description: details.description
          },
          disableClose: true,
          panelClass: 'payment-status-dialog'
        });
      }, 100);
    });
  }
}
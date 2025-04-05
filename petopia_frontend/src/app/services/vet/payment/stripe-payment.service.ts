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

  // stripe-payment.service.ts
createCheckoutSessionWithVet(paymentRequest: any): Observable<any> {
  return this.http.post(
    `${this.apiUrl}/create-checkout-session`,
    paymentRequest,
    { 
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      withCredentials: false
    }
  );
}

async redirectToCheckout(sessionId: string) {
  try {
    const stripe = await loadStripe('pk_test_51OpFDfKiR2IT5FaSc8l7iJlaZ1MiLvSDyyfqBVO7DbzGr5whXochBfHg0l4ckTwNt5nZhMDi08y2OqKcCjD4J5nP00CUs4zvYR');

    if (stripe) {
      const { error } = await stripe.redirectToCheckout({
        sessionId: sessionId
      });

      if (error) {
        console.error('Error redirecting to checkout:', error);
        this.showPaymentStatus('cancel');
      }
    }
  } catch (error) {
    console.error('Error redirecting to checkout:', error);
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

  getVetRevenue(vetId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/revenue/${vetId}`);
  }
  
}
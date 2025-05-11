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

  private apiUrl = 'http://petopia.local:31158/petopia/auth/api/payment';
  private defaultPaymentDetails = {
    amount: 50,
    description: 'Veterinary services payment'
  };
  private defaultEventPaymentDetails = {
    amount: 10,
    description: 'Event participation payment'
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

 // Event payment methods
 createCheckoutSessionForEvent(paymentRequest: any): Observable<any> {
  return this.http.post(
    `${this.apiUrl}/create-checkout-session-Event`,
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

showPaymentStatus(
  status: 'success' | 'cancel', 
  paymentDetails?: {amount: number, description: string}, 
  isEventPayment: boolean = false
): void {
  const details = paymentDetails || 
                 (isEventPayment ? this.defaultEventPaymentDetails : this.defaultPaymentDetails);
  
  const targetRoute = isEventPayment ? 'participations' : 'vet/dash-principale-user';
  
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
}
createCheckoutSessionWithShop(paymentRequest: any): Observable<any> {
  console.log("paymentRequest: "+paymentRequest);
  
  return this.http.post(
    `${this.apiUrl}/create-checkout-session-shop`,
    paymentRequest,
    { 
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      withCredentials: false
    }
  );
}

async redirectToCheckoutShop(sessionId: string) {
  try {
    const stripe = await loadStripe('pk_test_51OpFDfKiR2IT5FaSc8l7iJlaZ1MiLvSDyyfqBVO7DbzGr5whXochBfHg0l4ckTwNt5nZhMDi08y2OqKcCjD4J5nP00CUs4zvYR');

    if (stripe) {
      const { error } = await stripe.redirectToCheckout({
        sessionId: sessionId
      });

      if (error) {
        console.error('Error redirecting to checkout:', error);
        this.showPaymentStatusShop('cancel');
      }
    }
  } catch (error) {
    console.error('Error redirecting to checkout:', error);
    this.showPaymentStatusShop('cancel');
  }
}

  showPaymentStatusShop(status: 'success' | 'cancel', paymentDetails?: {amount: number, description: string}): void {
    // Utilise les détails fournis ou les valeurs par défaut
    const details = paymentDetails;
    
    this.router.navigate(['cart'], {
      queryParams: { payment_status: status }
    }).then(() => {
      console.log(details);
      
    });
  }

  getVetRevenue(vetId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/revenue/${vetId}`);
  }

  getVetPayments(vetId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/vet-payments/${vetId}`);
  }

  handleEventPaymentSuccess(): void {
    this.router.navigate(['/participations'], {
      queryParams: { payment_status: 'success' }
    }).then(() => {
      this.showPaymentStatus('success', undefined, true);
    });
  }
  handleEventPaymentCancel(): void {
    this.router.navigate(['/participations'], {
      queryParams: { payment_status: 'cancel' }
    }).then(() => {
      this.showPaymentStatus('cancel', undefined, true);
    });
  }

  checkEventPaymentStatus(): void {
    const urlTree = this.router.parseUrl(this.router.url);
    const status = urlTree.queryParams['payment_status'];
    
    if (status) {
      if (status === 'success') {
        this.showPaymentStatus('success', undefined, true);
      } else if (status === 'cancel') {
        this.showPaymentStatus('cancel', undefined, true);
      }
      
      // Clean up the URL by removing the query params
      this.router.navigate([], {
        queryParams: {},
        replaceUrl: true
      });
    }
  }
}
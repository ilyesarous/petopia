import { Component, OnInit } from '@angular/core';
import { StripePaymentService } from 'src/app/services/vet/payment/stripe-payment.service';

@Component({
  selector: 'app-payment-vet',
  templateUrl: './payment-vet.component.html',
  styleUrls: ['./payment-vet.component.css']
})
export class PaymentVetComponent implements OnInit {
  payments: any[] = [];
  isLoading = true;
  totalRevenue = 0;

  constructor(
    private paymentService: StripePaymentService  ) {}

  ngOnInit(): void {
    const vetId = localStorage.getItem('userId');
    if (vetId) {
      this.loadPayments(parseInt(vetId, 10));
      this.loadTotalRevenue(parseInt(vetId, 10));
    }
  }

  loadPayments(vetId: number): void {
    this.paymentService.getVetPayments(vetId).subscribe({
      next: (data) => {
        this.payments = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading payments:', err);
        this.isLoading = false;
      }
    });
  }

  loadTotalRevenue(vetId: number): void {
    this.paymentService.getVetRevenue(vetId).subscribe({
      next: (revenue) => {
        this.totalRevenue = revenue || 0;
      },
      error: (err) => {
        console.error('Error loading revenue:', err);
      }
    });
  }

}
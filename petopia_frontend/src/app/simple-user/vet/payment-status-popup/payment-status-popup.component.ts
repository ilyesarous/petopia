import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-payment-status-popup',
  templateUrl: './payment-status-popup.component.html',
  styleUrls: ['./payment-status-popup.component.css']
})
export class PaymentStatusPopupComponent {
  paymentDetails = {
    amount: 50,
    currency: 'TND',
    description: 'Veterinary services payment',
    date: new Date().toLocaleDateString()
  };

  constructor(
    public dialogRef: MatDialogRef<PaymentStatusPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { 
      status: 'success' | 'cancel',
      amount?: number,
      description?: string 
    }
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }
  
}
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/user/auth.service';
import { StripePaymentService } from 'src/app/services/vet/payment/stripe-payment.service';

@Component({
  selector: 'app-vet-selection-popup',
  templateUrl: './vet-selection-popup.component.html',
  styleUrls: ['./vet-selection-popup.component.css']
})
export class VetSelectionPopupComponent {

  vets: any[] = [];
  selectedVetId: number | null = null;
  isLoading = true;
  error: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<VetSelectionPopupComponent>,
    private authService: AuthService,
    private stripeService: StripePaymentService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.loadVets();
  }

  loadVets(): void {
    this.authService.getAllVets().subscribe({
      next: (vets) => {
        console.log('Liste des vétérinaires:', vets);
        this.vets = vets; // Mettre à jour la liste des vétérinaires
        this.isLoading = false; // Désactiver le loading
      },
      error: (err) => {
        console.error('Error loading vets:', err);
        this.error = 'Failed to load veterinarians';
        this.isLoading = false;
      }
    });
  }

  selectVet(): void {
    if (this.selectedVetId) {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        this.error = 'User not authenticated';
        return;
      }

      const paymentRequest = {
        amount: 50,
        currency: 'tnd',
        type: 'VET',
        description: 'Veterinary services payment',
        paymentDate: new Date().toISOString(),
        userId: parseInt(userId, 10),
        vetId: this.selectedVetId
      };

      this.stripeService.createCheckoutSessionWithVet(paymentRequest).subscribe({
        next: (response: any) => {
          this.dialogRef.close();
          this.stripeService.redirectToCheckout(response.sessionId);
        },
        error: (err) => {
          this.error = 'Failed to create payment session';
          console.error(err);
        }
      });
    }
  }

  close(): void {
    this.dialogRef.close();
  }

}

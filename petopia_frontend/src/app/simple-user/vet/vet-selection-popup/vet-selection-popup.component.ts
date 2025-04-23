import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/user/auth.service';
import { StripePaymentService } from 'src/app/services/vet/payment/stripe-payment.service';
import { Consultation } from 'src/app/models/vet/consultation';
import { ConsultationService } from 'src/app/services/vet/consultations/consultation.service';

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
  consultations: Consultation[] = [];
  selectedConsultationId: number | null = null;

  constructor(
    public dialogRef: MatDialogRef<VetSelectionPopupComponent>,
    private authService: AuthService,
    private stripeService: StripePaymentService,
    private consultationService: ConsultationService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.loadConsultations();
  }

  loadConsultations(): void {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      this.error = 'User not authenticated';
      this.isLoading = false;
      return;
    }

    this.consultationService.getConsultationsByUserId(parseInt(userId, 10)).subscribe({
      next: (consultations) => {
        // Filtrer pour ne garder que les consultations avec statut 'accepted'
        this.consultations = consultations.filter(consult => consult.statusT === 'accepted');
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading consultations:', err);
        this.error = 'Failed to load your consultations';
        this.isLoading = false;
      }
    });
  }

  proceedToPayment(): void {
    if (this.selectedConsultationId) {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        this.error = 'User not authenticated';
        return;
      }

      // Trouver la consultation sélectionnée
      const selectedConsultation = this.consultations.find(c => c.idConsultation === this.selectedConsultationId);
      if (!selectedConsultation) {
        this.error = 'Selected consultation not found';
        return;
      }

      const paymentRequest = {
        amount: 50,
        currency: 'tnd',
        type: 'VET',
        description: 'Veterinary services payment',
        paymentDate: new Date().toISOString(),
        userId: parseInt(userId, 10),
        vetId: selectedConsultation.uservet.id_user 
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

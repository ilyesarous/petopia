
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationStateService } from 'src/app/services/vet/notifications/notification-state.service';
import { ConsultationService } from 'src/app/services/vet/consultations/consultation.service';
import { Consultation } from 'src/app/models/vet/consultation';
import { DomSanitizer } from '@angular/platform-browser';
import { StripePaymentService } from 'src/app/services/vet/payment/stripe-payment.service';
import {Pet} from "src/app/models/pet/Pet"; 

@Component({
  selector: 'app-dash-principale-home-vet',
  templateUrl: './dash-principale-home-vet.component.html',
  styleUrls: ['./dash-principale-home-vet.component.css']
})
export class DashPrincipaleHomeVetComponent implements OnInit {

  totalAppointments: number = 0;
  todayAppointments: Consultation[] = [];
  hasAppointmentsToday = false;
  defaultPetImage = 'assets/images/logo.png';
  vetRevenue: number = 0;
  uniquePets: Pet[] = [];
  loadingPets = false;
  totalPatients: number = 0;


  constructor(
    private router: Router,
    private notificationState: NotificationStateService,
    private consultationService: ConsultationService,
    private sanitizer: DomSanitizer,
    private stripePaymentService: StripePaymentService
  ) {}

  ngOnInit(): void {
    this.loadConsultations();
    this.loadVetRevenue();
    this.loadUniquePets();
  }

  loadVetRevenue(): void {
    const vetId = localStorage.getItem('userId'); 
    if (vetId) {
      this.stripePaymentService.getVetRevenue(+vetId).subscribe(
        (revenue) => {
          this.vetRevenue = revenue;
        },
        (error) => {
          console.error('Error fetching vet revenue:', error);
          this.vetRevenue = 0;
        }
      );
    }
  }

  loadConsultations(): void {
    const vetId = localStorage.getItem('userId');
    
    if (!vetId || isNaN(Number(vetId))) {
        console.error('Invalid vet ID');
        return;
    }

    this.consultationService.getAllConsultations().subscribe({
        next: (consultations) => {
            const today = new Date().toISOString().split('T')[0];
            
            // Filtrer les consultations d'aujourd'hui pour ce vétérinaire
            this.todayAppointments = consultations.filter(c => {
                return c.consultation_date.startsWith(today) && 
                       c.uservet?.id_user === Number(vetId);
            });
            
            // Mettre à jour les variables d'état
            this.totalAppointments = this.todayAppointments.length;
            this.hasAppointmentsToday = this.totalAppointments > 0;
            
            console.log('Today appointments for vet:', this.todayAppointments);
        },
        error: (err) => {
            console.error('Error loading consultations', err);
        }
    });
}

  getConsultationColor(type: string): string {
    return type === 'meet' ? '#F83182' : '#FE9A7A';
  }

  getPetInitial(petName: string): string {
    return petName ? petName.charAt(0).toUpperCase() : '';
  }

  getPetImage(pet: any): any {
    if (pet?.imageUrl) {
      return this.sanitizer.bypassSecurityTrustUrl(pet.imageUrl);
    }
    return this.defaultPetImage;
  }

  toggleNotifications() {
    this.notificationState.toggleNotifications(true);
  }

  redirectToUrlDogBreedRecognition() {
    window.location.href = 'http://localhost:8501';
  }

  loadUniquePets(): void {
    this.loadingPets = true;
    const vetId = localStorage.getItem('userId');
    
    if (vetId && !isNaN(Number(vetId))) {
      this.consultationService.getUniquePetsForVet(Number(vetId)).subscribe({
        next: (pets) => {
          this.uniquePets = pets;
          this.totalPatients = pets.length; 
          this.loadingPets = false;
          console.log('Unique pets loaded:', pets);
        },
        error: (err) => {
          console.error('Error loading unique pets:', err);
          this.loadingPets = false;
        }
      });
    } else {
      console.error('Invalid vet ID');
      this.loadingPets = false;
    }
  }

}

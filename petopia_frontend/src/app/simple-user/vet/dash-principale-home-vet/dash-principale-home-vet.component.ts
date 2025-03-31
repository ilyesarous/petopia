import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationStateService } from 'src/app/services/vet/notifications/notification-state.service';
import { ConsultationService } from 'src/app/services/vet/consultations/consultation.service';
import { Consultation } from 'src/app/models/vet/consultation';
import { DomSanitizer } from '@angular/platform-browser';

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

  constructor(
    private router: Router,
    private notificationState: NotificationStateService,
    private consultationService: ConsultationService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadConsultations();
  }

  loadConsultations(): void {
    this.consultationService.getAllConsultations().subscribe({
      next: (consultations) => {
        const today = new Date().toISOString().split('T')[0];
        
        // Filtrer les consultations d'aujourd'hui
        this.todayAppointments = consultations.filter(c => {
          // Ajoutez un log pour déboguer
          console.log('Consultation date:', c.consultation_date, 'Today:', today);
          return c.consultation_date.startsWith(today);
        });
        
        // Mettre à jour les variables d'état
        this.totalAppointments = this.todayAppointments.length;
        this.hasAppointmentsToday = this.totalAppointments > 0;
        
        // Log pour vérification
        console.log('Today appointments:', this.todayAppointments);
        console.log('Total appointments today:', this.totalAppointments);
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
}
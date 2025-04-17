import { NotificationService } from 'src/app/services/vet/notifications/notification.service';
import { DiagnosisService } from 'src/app/services/vet/diagnoses/diagnosis.service';
import { PetGrowthsService } from 'src/app/services/vet/pet-growth/pet-growths.service';
import { ConsultationService } from 'src/app/services/vet/consultations/consultation.service';
import { Component, OnInit } from '@angular/core';
import { VetLocationService } from 'src/app/services/vet/location/vet-location.service';
import { VetRatingService } from 'src/app/services/vet/rating/vet-rating.service';
import { NotificationStateService } from 'src/app/services/vet/notifications/notification-state.service';


@Component({
  selector: 'app-dash-principale',
  templateUrl: './dash-principale.component.html',
  styleUrls: ['./dash-principale.component.css'],
})
export class DashPrincipaleComponent implements OnInit {

  seenCount: number = 0; // Nombre de notifications vues
  unseenCount: number = 0; // Nombre de notifications non vues

  totalNotifications: number = 0;
  totalDiagnoses: number = 0;
  totalPetGrowths: number = 0;
  totalConsultations: number = 0;
  totalLocations: number = 0;
  totalRatings: number = 0;



  //constructor(private notificationService: NotificationService) { }
  constructor(
    private notificationService: NotificationService,
    private diagnosisService: DiagnosisService,
    private petGrowthService: PetGrowthsService,
    private consultationService: ConsultationService,
    private vetLocationService: VetLocationService,
    private vetRatingService: VetRatingService,
    private notificationState: NotificationStateService,
  ) { }

  ngOnInit(): void {
    this.loadNotificationStats();
    this.loadTotalCounts();
  }

  loadNotificationStats(): void {
    this.notificationService.getAllNotifications().subscribe(
      (notifications: any[]) => {
        console.log('Notifications:', notifications); // Les données sont bien récupérées
        this.seenCount = notifications.filter(n => n.seen).length;
        this.unseenCount = notifications.filter(n => !n.seen).length;
        console.log('Seen Count:', this.seenCount); // Doit afficher 2
        console.log('Unseen Count:', this.unseenCount); // Doit afficher 1
      },
      (error) => {
        console.error('Error fetching notifications', error);
      }
    );
  }

  loadTotalCounts(): void {
    // Récupérer le nombre total de notifications
    this.notificationService.getAllNotifications().subscribe(
      (notifications) => {
        this.totalNotifications = notifications.length;
      },
      (error) => {
        console.error('Error fetching notifications', error);
      }
    );

    // Récupérer le nombre total de diagnostics
    this.diagnosisService.getAllDiagnosis().subscribe(
      (diagnoses) => {
        this.totalDiagnoses = diagnoses.length;
      },
      (error) => {
        console.error('Error fetching diagnoses', error);
      }
    );

    // Récupérer le nombre total de suivis de croissance
    this.petGrowthService.getAllPetGrowths().subscribe(
      (petGrowths) => {
        this.totalPetGrowths = petGrowths.length;
      },
      (error) => {
        console.error('Error fetching pet growths', error);
      }
    );

    // Récupérer le nombre total de consultations
    this.consultationService.getAllConsultations().subscribe(
      (consultations) => {
        this.totalConsultations = consultations.length;
      },
      (error) => {
        console.error('Error fetching consultations', error);
      }
    );

    // Récupérer le nombre total de localisations
    this.vetLocationService.getAllLocations().subscribe(
      (locations) => {
        this.totalLocations = locations.length;
      },
      (error) => {
        console.error('Error fetching locations', error);
      }
    );

    // Récupérer le nombre total de Ratings
    this.vetRatingService.getAllRatings().subscribe(
      (ratings) => {
        this.totalRatings = ratings.length;
      },
      (error) => {
        console.error('Error fetching ratings', error);
      }
    );

  }


  

}

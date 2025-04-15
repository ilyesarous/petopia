import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Participation } from 'src/app/models/EventModule/participation';
import { EventService } from 'src/app/services/Event/event.service';
import { ParticipationService } from 'src/app/services/Event/participation.service';
import { interval, Subscription, timer } from 'rxjs';
import { Coupon } from 'src/app/models/EventModule/coupon';
import { AuthService } from 'src/app/services/user/auth.service';

@Component({
  selector: 'app-participation-list',
  templateUrl: './participation-list.component.html',
  styleUrls: ['./participation-list.component.css']
})
export class ParticipationListComponent implements OnInit {
  participations: Participation[] = [];
  userId: number = 0; // ID de l'utilisateur connecté
  isLoading = false; // For loading state

  showCountdown = false; // Ajoutez cette propriété
  countdownParticipation?: Participation; // Ajoutez cette propriété
  private countdownSub?: Subscription;


  userXp: number = 0;
  userLevel: number = 1;
  userCoupons: Coupon[] = [];

  constructor(
    private participationService: ParticipationService,
    private router: Router,
    private eventService: EventService,
    private userService: AuthService,
    // Ajoutez ceci
  ) {
    // S'abonner aux changements de route
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.loadAllParticipations(); // Recharger à chaque changement de route
    });
  }

  ngOnInit(): void {
    const storedUserId = localStorage.getItem('userId');
    this.userId = storedUserId ? parseInt(storedUserId, 10) : 0;

    this.loadAllParticipations(); // Chargement initial
    this.startGlobalCountdown();
    //this.loadUserData();

  }

  loadUserData(): void {
    if (this.userId)  {
      this.userService.getUserById(this.userId).subscribe(user => {
        this.userXp = user.xpPoints;
        this.userLevel = user.level;
        this.userCoupons = user.coupons;
      });
    }
  }
  ngOnDestroy(): void {
    // Nettoyer l'abonnement
    this.countdownSub?.unsubscribe();
  }

  loadAllParticipations(): void {
    this.isLoading = true;
  
    this.participationService.getParticipationById(this.userId).subscribe({
      next: (data) => {
        this.participations = data;
        this.isLoading = false;
        
        // Pour chaque participation, récupérer le temps restant depuis le backend
        this.participations.forEach(p => {
          if (p.idParticipation) {
            this.participationService.getTimeRemaining(p.idParticipation).subscribe({
              next: (time) => {
                p.timeRemaining = time;
              },
              error: () => {
                // Fallback au calcul frontend si l'API échoue
                if (p.event?.dateEvent) {
                  p.timeRemaining = this.calculateTimeRemaining(p.event.dateEvent);
                }
              }
            });
          }
        });
      },
      error: (err) => console.error('Erreur:', err)
    });
  }

  startGlobalCountdown(): void {
    this.countdownSub = timer(0, 1000).subscribe(() => {
      this.participations.forEach(p => {
        if (p.event?.dateEvent) {
          p.timeRemaining = this.calculateTimeRemaining(p.event.dateEvent);
          // Arrêter le compte à rebours si l'événement est passé
          if (p.timeRemaining <= 0) {
            p.timeRemaining = 0;
          }
        }
      });
    });
  }
  calculateTimeRemaining(eventDate: Date): number {
    const eventTime = new Date(eventDate).getTime();
    const now = new Date().getTime();
    return eventTime - now;
  }
  formatTime(ms: number): string {
    if (ms <= 0) return 'Événement terminé';
  
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));

  // Version courte si moins d'un jour
  if (days === 0) {
    return `${this.padZero(hours)}:${this.padZero(minutes)}:${this.padZero(seconds)}`;
  }
  
  return `${days}j ${this.padZero(hours)}h ${this.padZero(minutes)}m`;
  }
  private padZero(num: number): string {
    return num < 10 ? `0${num}` : num.toString();
  }
  // In participation-list.component.ts
deleteParticipation(participationId: number | undefined): void {
  if (!participationId) {
    console.error('No participation ID provided');
    return;
  }

  if (confirm('Êtes-vous sûr de vouloir annuler cette participation ?')) {
    this.participationService.deleteParticipation(participationId).subscribe({
      next: () => {
        this.participations = this.participations.filter(
          p => p.idParticipation === participationId
        );
        alert('Participation annulée avec succès');
        this.loadAllParticipations(); // Chargement initial

      },
      error: (err) => {
        console.error('Erreur lors de la suppression:', err);
        alert('Une erreur est survenue lors de l\'annulation');
      }
    });
  }
}

// Ajoutez cette méthode pour la navigation
navigateToEvents(): void {
  this.router.navigate(['/events']);
}

// Ajoutez ces méthodes à votre ParticipationListComponent
getDays(ms: number): number {
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

getHours(ms: number): number {
  return Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
}

getMinutes(ms: number): number {
  return Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
}

getSeconds(ms: number): number {
  return Math.floor((ms % (1000 * 60)) / 1000);
}
}
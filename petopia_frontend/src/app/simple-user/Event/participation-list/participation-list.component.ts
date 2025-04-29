import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Participation } from 'src/app/models/EventModule/participation';
import { EventService } from 'src/app/services/Event/event.service';
import { ParticipationService } from 'src/app/services/Event/participation.service';
import { interval, Subscription, timer } from 'rxjs';
import { Coupon } from 'src/app/models/EventModule/coupon';
import { AuthService } from 'src/app/services/user/auth.service';
import { StripePaymentService } from 'src/app/services/vet/payment/stripe-payment.service';


@Component({
  selector: 'app-participation-list',
  templateUrl: './participation-list.component.html',
  styleUrls: ['./participation-list.component.css']
})

export class ParticipationListComponent implements OnInit {
  showPaymentSuccess = false;
  paymentSuccessMessage = '';
  currentPaymentEventId: number | null = null;
  paid?: boolean = false;
  paidNow: boolean = true;
  user: any;

  participations: Participation[] = [];
  userId: number = 0; // ID de l'utilisateur connecté
  isLoading = false;
  private countdownSub?: Subscription;

  // showCountdown = false; // Ajoutez cette propriété
  // countdownParticipation?: Participation; // Ajoutez cette propriété

  userXp: number = 0;
  userLevel: number = 1;
  userCoupons: Coupon[] = [];

  constructor(
    private participationService: ParticipationService,
    private router: Router,
    private eventService: EventService,
    private userService: AuthService,
    private stripePaymentService: StripePaymentService
  ) {
    // S'abonner aux changements de route
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.loadAllParticipations(); // Recharger à chaque changement de route
    });
  }

  ngOnDestroy(): void {
    // Nettoyer l'abonnement
    this.countdownSub?.unsubscribe();
  }
  ngOnInit(): void {
    const storedUserId = localStorage.getItem('userId');
    this.userId = storedUserId ? parseInt(storedUserId, 10) : 0;

    this.initializeUserDashboard();
    // this.paidNow = localStorage.getItem("isPaid") === "true" ? true : false;
  }

  initializeUserDashboard(): void {
    if (!this.userId) {
      console.error('No user ID found.');
      return;
    }

    this.isLoading = true;

    this.loadUserData(this.userId);
    this.loadAllParticipations();
  }



  loadUserData(userId: number): void {

    this.userService.getUserById(userId).subscribe(user => {
      this.user = user;
    });

  }


  loadAllParticipations(): void {
    this.isLoading = true;
    this.countdownSub?.unsubscribe();
    
    this.participationService.getParticipationById(this.userId).subscribe({
      next: (data) => {
        this.participations = data;
        this.isLoading = false;
        this.startGlobalCountdown();
      },
      error: (err) => console.error('Erreur:', err)
    });
  }
  

  startGlobalCountdown(): void {
    this.countdownSub = interval(1000).subscribe(() => {
      this.participations.forEach(p => {
        if (p.event?.dateEvent) {
          const eventDate = new Date(p.event.dateEvent);
          // Add time if your event has time component
          // eventDate.setHours(hours, minutes, 0, 0);
          p.timeRemaining = eventDate.getTime() - Date.now();
        }
      });
    });
  }

  formatTime(ms: number): string {
    if (ms <= 0) return 'Event has started';

    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    }
    return `${hours}h ${minutes}m ${seconds}s`;
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


  payForParticipation(participation: Participation): void {
    if (!participation.event) {
      console.error('No event associated with this participation');
      return;
    }
    // this.paidNow = !this.paidNow;
    // localStorage.setItem("isPaid", this.paidNow.toString());
    participation.paid = true;
    participation.isPaying = true;



    this.updatePaymentStatus(participation.idParticipation!);


    this.currentPaymentEventId = participation.event.idEvent;

    const paymentRequest = {
      amount: participation.event.prixEvent,
      description: `Participation for event: ${participation.event.nameEvent}`,
      type: 'EVENT',
      userId: this.userId,
      event: {
        idEvent: participation.event.idEvent
      }
    };

    this.stripePaymentService.createCheckoutSessionForEvent(paymentRequest).subscribe({
      next: (response: any) => {

        if (response.sessionId) {
          //this.listenForPaymentSuccess(participation.event!.idEvent, participation);
          this.stripePaymentService.redirectToCheckout(response.sessionId);

        } else {
          participation.isPaying = false;
          console.error('No session ID received from server');
        }
      },
      error: (err) => {
        participation.isPaying = false;
        console.error('Error creating checkout session:', err);
        // Handle error (show message to user)
      }
    });
    this.paidNow = true;

  }

  // Add this new method to listen for payment success
  private listenForPaymentSuccess(eventId: number, participation: Participation): void {
    const eventSource = new EventSource(`http://localhost:8082/petopia/participations
/payments/status/${eventId}`);

    eventSource.addEventListener('payment_success', (event) => {
      const data = JSON.parse(event.data);
      this.paymentSuccessMessage = `Payment confirmed for ${data.eventName}`;
      this.showPaymentSuccess = true;
      this.paidNow = true;

      // Set paid and stop spinner
      participation.paid = true;
      participation.isPaying = false;

      // Update the participation status
      this.participations = this.participations.map(p => {
        if (p.event?.idEvent === eventId) {
          return { ...p, paid: true };
        }
        return p;
      });

      eventSource.close();
    });

    eventSource.addEventListener('error', (err) => {
      console.error('EventSource error:', err);
      participation.isPaying = false;
      eventSource.close();
    });
  }
  closePaymentSuccess(): void {
    this.showPaymentSuccess = false;
    this.currentPaymentEventId = null;
  }

  private updatePaymentStatus(participationId: number): void {
    const updatePayload = {
      paid: true,
      statusParticipation: 'CONFIRMED'
    };

    this.participationService.updateParticipation(participationId, updatePayload).subscribe({
      next: () => {
        console.log('Payment status updated on server');
        // Ne pas recharger pour garder l'état immédiat
      },
      error: (err) => {
        console.error('Error updating payment status:', err);
      }
    });
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


  // Add this method to view event details
  viewEventDetails(eventId: number): void {
    this.router.navigate(['/event', eventId]); // Updated to match the route we defined
  }
  // Add this method to confirm participation
  confirmParticipation(participationId: number | undefined): void {
    if (!participationId) {
      console.error('No participation ID provided');
      return;
    }

    this.participationService.confirmParticipation(participationId).subscribe({
      next: () => {
        alert('Participation confirmed successfully');
        this.loadAllParticipations(); // Refresh the list
      },
      error: (err) => {
        console.error('Error confirming participation:', err);
        alert('Error confirming participation');
      }
    });
  }
}
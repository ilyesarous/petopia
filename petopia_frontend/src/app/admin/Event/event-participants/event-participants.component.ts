import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ParticipationService } from 'src/app/services/Event/participation.service';
import { Participation, ParticipationStatus } from 'src/app/models/EventModule/participation';
import { EventService } from 'src/app/services/Event/event.service';
import { Event as AppEvent } from 'src/app/models/EventModule/appevent'; // Importez le modèle Event
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-event-participants',
  templateUrl: './event-participants.component.html',
  styleUrls: ['./event-participants.component.css']
})
export class EventParticipantsComponent implements OnInit {
  participants: Participation[] = [];
  eventId!: number;
  eventName: string = 'Chargement...'; // Initialisation par défaut
  isLoading = true;
  error: string | null = null;
  private refreshInterval: any;
  private destroy$ = new Subject<void>();
private refresh$ = new Subject<void>();


  statusOptions = Object.values(ParticipationStatus); // Ajoutez cette ligne
  editingParticipations: {[key: number]: boolean} = {}; // Pour gérer l'édition

  constructor(
    private route: ActivatedRoute,
    private participationService: ParticipationService,
    private eventService: EventService // Ajoutez ce service

  ) {}

  ngOnInit(): void {
    this.eventId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadEventDetails(); // Chargez d'abord les détails de l'événement
 // S'abonner aux mises à jour en temps réel
 this.refresh$.pipe(
  takeUntil(this.destroy$)
).subscribe(() => {
  this.loadParticipants();
});

// Chargement initial
this.loadParticipants();

// Écouter les événements SSE pour les mises à jour en temps réel
this.setupSSEListener();
 }

 private setupSSEListener(): void {
  const eventSource = new EventSource(`http://petopia.local:31158/api/participations/updates`);
  
  eventSource.addEventListener('participation_updated', (event) => {
    const updatedParticipation = JSON.parse(event.data);
    if (updatedParticipation.event?.idEvent === this.eventId) {
      this.refresh$.next(); // Déclencher le rafraîchissement
    }
  });

  eventSource.onerror = (error) => {
    console.error('EventSource failed:', error);
    eventSource.close();
  };
}
 ngOnDestroy(): void {
  this.destroy$.next();
  this.destroy$.complete();
}

  loadParticipants(): void {
    this.isLoading = true;
    this.error = null;
    
    this.participationService.getParticipationEventById(this.eventId).subscribe({
      next: (data: any) => {
        console.log('Données reçues:', data); // Ajoutez ce log pour debug
        this.participants = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur complète:', err); // Log l'erreur complète
        this.error = 'Erreur lors du chargement des participants';
        this.isLoading = false;
      }
    });
  }
  loadEventDetails(): void {
    this.eventService.getEventById(this.eventId).subscribe({
      next: (event: AppEvent) => {
        this.eventName = event.nameEvent;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des détails de l\'événement:', err);
        this.eventName = 'Nom non disponible'; // Valeur par défaut en cas d'erreur
      }
    });
  }

    // Ajoutez cette méthode pour activer l'édition
    editParticipation(participationId: number): void {
      this.editingParticipations[participationId] = true;
    }

      // Ajoutez cette méthode pour sauvegarder les modifications
  // saveParticipationStatus(participation: Participation): void {
  //   if (!participation.idParticipation) return;

  //   this.participationService.updateParticipation(
  //     participation.idParticipation, 
  //     participation
  //   ).subscribe({
  //     next: () => {
  //       this.editingParticipations[participation.idParticipation!] = false;
  //       // Recharger les données si nécessaire
  //       this.loadParticipants();
  //     },
  //     error: (err) => {
  //       console.error('Erreur lors de la mise à jour:', err);
  //       alert('Une erreur est survenue lors de la mise à jour');
  //     }
  //   });
  // }

  saveParticipationStatus(participation: Participation): void {
    if (!participation.idParticipation) return;
  
    // Prepare the update payload
    const updatePayload = {
      statusParticipation: participation.statusParticipation,
      paid: participation.paid
    };
  
    this.participationService.updateParticipation(
      participation.idParticipation, 
      updatePayload // Send the updated payload
    ).subscribe({
      next: () => {
        this.editingParticipations[participation.idParticipation!] = false;
        // Optional: Show success message
        console.log('Participation updated successfully');
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour:', err);
        alert('Une erreur est survenue lors de la mise à jour');
      }
    });
  }


    // Ajoutez cette méthode pour annuler l'édition
    cancelEdit(participationId: number): void {
      this.editingParticipations[participationId] = false;
      // Recharger les données pour annuler les modifications
      this.loadParticipants();
    }
  
  goBack(): void {
    window.history.back();
  }
}
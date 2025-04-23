import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from 'src/app/services/Event/event.service';
import { AuthService } from 'src/app/services/user/auth.service'; // Importer AuthService
import { Participation } from 'src/app/models/EventModule/participation'; // Assurez-vous que le chemin est correct
import { ParticipationService } from 'src/app/services/Event/participation.service';
import { Event } from 'src/app/models/EventModule/appevent'; // Assurez-vous que le chemin est correct

import { ViewChild, ElementRef } from '@angular/core';
import { EventNotification, EventNotificationService } from 'src/app/services/Event/EventNotification';
import { Subscription } from 'rxjs';
import { CalendarOptions, EventApi } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FullCalendarModule } from '@fullcalendar/angular';



declare var bootstrap: any; 
@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
  
})
export class EventListComponent implements OnInit {
  events: any[] = [];
  isAdmin: boolean = false; // Variable pour savoir si l'utilisateur est un admin
  selectedEvent: Event | null = null; // L'événement sélectionné pour participer
  @ViewChild('editEventModal') editEventModal!: ElementRef;
  role: string = '';
  editMode: boolean = false;  // Pour contrôler l’affichage du formulaire d’édition
  eventToEdit: Event | null = null;  // Contient l’événement à modifier
  showParticipationPopup: boolean = false;
  notifications: EventNotification[] = [];

  filters: any = {};


  showCalendar: boolean = false;
calendarOptions: CalendarOptions = {
  initialView: 'dayGridMonth',
  plugins: [dayGridPlugin, interactionPlugin],
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,dayGridWeek,dayGridDay'
  },
  events: [],
  eventClick: this.handleEventClick.bind(this),
  eventDisplay: 'block'
};


  private notificationSubscription!: Subscription;
  private eventsSubscription!: Subscription;
  private roleSubscription!: Subscription;

  
  filtersExpanded: boolean = false;
  eventTypes = [
    { value: 'PROMENADE', label: 'Promenade' },
    { value: 'RANDONNEE', label: 'Randonnée' },
    { value: 'PHOTO_SEANCE', label: 'Séance photo' }
  ];
  statusOptions = [
    { value: 'ACTIF', label: 'Actif' },
    { value: 'ANNULE', label: 'Annulé' },
    { value: 'TERMINE', label: 'Terminé' }
  ];


  
  constructor(private eventService: EventService,
                private router: Router,
                private authService: AuthService, 
                private participationService: ParticipationService,
                private notificationService: EventNotificationService) {}

  ngOnInit(): void {
          // Pour chaque événement, récupérer l'organisateur si c'est un ID
          this.events.forEach(event => {
            // if (typeof event.organisateur === 'number') {  // Si l'organisateur est un ID
              this.authService.getUserById(event.organisateur).subscribe(user => {
                event.organisateur = user;  // Remplacer l'ID par l'objet user
              // });
            }) });

            this.authService.role.subscribe((role) => {
              this.role = role || ''; // Ensure role is never undefined
            });
        
        // Se abonner à l'observable pour recevoir les mises à jour en temps réel
        this.eventService.events$.subscribe((data) => {
          this.events = data;  // Met à jour la liste des événements
        });

        // Charger les événements au démarrage
        this.eventService.loadEvents();

        // Vérifier si l'utilisateur est un admin  


            // ✅ Subscribe to notifications
    this.notificationService.getNotifications().subscribe((notifs) => {
      this.notifications = notifs;
    });
    //this.setupSubscriptions();

}

// ngOnDestroy(): void {
//   this.cleanupSubscriptions();
// }

// private setupSubscriptions(): void {
//   this.roleSubscription = this.authService.role.subscribe((role) => {
//     this.role = role || '';
//   });

//   this.eventsSubscription = this.eventService.events$.subscribe((data) => {
//     this.events = data;
//     this.loadOrganizers();
//   });

//   this.notificationSubscription = this.notificationService.getNotifications().subscribe((notifs) => {
//     this.notifications = notifs;
//   });
// }

// private loadOrganizers(): void {
//   this.events.forEach(event => {
//     if (event.organisateur) {
//       this.authService.getUserById(event.organisateur).subscribe(user => {
//         event.organisateur = user;
//       });
//     }
//   });
// }

// private cleanupSubscriptions(): void {
//   this.roleSubscription?.unsubscribe();
//   this.eventsSubscription?.unsubscribe();
//   this.notificationSubscription?.unsubscribe();
// }

// In event-list.component.ts
getAvailablePlaces(event: Event): number {
  if (!event.participations || event.participations.length === 0) {
    return event.placesMaxEvent;
  }
  
  return event.placesMaxEvent - event.participations.length;
}
clearNotifications() {
  this.notifications = [];
}

dismissNotification(notification: any) {
  this.notifications = this.notifications.filter(n => n !== notification);
}
  loadEvents() {
    
    this.eventService.getEvents().subscribe(
      (data) => {
        this.events = data;
      },
      (error) => {
        console.error("Erreur lors du chargement des événements :", error);
      }
    );
  }
  
  goToAddEvent() {
    this.router.navigate(['/add-event']);
  }

  // Méthode pour supprimer un événement
  deleteEvent(idEvent: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      this.eventService.deleteEvent(idEvent).subscribe({
        next: () => {
          // Supprime l'événement localement après suppression réussie du backend
          this.events = this.events.filter(event => event.idEvent !== idEvent);
          alert('Événement supprimé avec succès');
        },
        error: (err) => {
          console.error('Erreur de suppression', err);
          alert('Une erreur est survenue lors de la suppression de l\'événement');
        }
      });
    }
}
 // Méthode pour sélectionner un événement et afficher le formulaire
 // Fonction pour afficher le formulaire de participation
 selectEvent(event: Event): void {
  this.selectedEvent = event;
  this.showParticipationPopup = true;
}
// Méthode pour réinitialiser la sélection
closeForm(): void {
  this.selectedEvent = null;
}

closeParticipationForm(): void {
  this.selectedEvent = null; 
  this.showParticipationPopup = false;// Fermer le formulaire (réinitialiser l'événement sélectionné)
}

// Méthode pour modifier un événement
updateEvent(): void {
  if (this.eventToEdit) {



    this.eventService.updateEvent(this.eventToEdit.idEvent, this.eventToEdit).subscribe({
      next: () => {
        alert('Événement mis à jour avec succès');
        this.editMode = false;  // Fermer le formulaire après la mise à jour
        this.eventToEdit = null; // Réinitialiser l'événement à modifier
        this.eventService.loadEvents(); // Recharger la liste des événements
        console.log('Mise à jour de l\'événement :', this.eventToEdit);

      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour :', err);
        alert('Erreur lors de la mise à jour');
      }
    });
  } else {
    alert('Aucun événement sélectionné à modifier');
  }
}

editEvent(event: Event): void {
  this.eventToEdit = { ...event }; // Clone
  setTimeout(() => {
    const modal = new bootstrap.Modal(document.getElementById('editEventModal'));
    modal.show();
  }, 0);
}

cancelEdit(): void {
  this.eventToEdit = null;
  this.editMode = false;
}

// saveUpdatedEvent(): void {
//   if (this.eventToEdit) {
//     this.eventService.updateEvent(this.eventToEdit.idEvent, this.eventToEdit).subscribe({
//       next: () => {
//         alert('Événement mis à jour avec succès');
//         this.editMode = false;
//         this.eventToEdit = null;
//         this.eventService.loadEvents();
//       },
//       error: (err) => {
//         console.error('Erreur de mise à jour', err);
//         alert('Erreur lors de la mise à jour');
//       }
//     });
//   }
// }

saveUpdatedEvent(): void {
  if (this.eventToEdit) {
    this.eventService.updateEvent(this.eventToEdit.idEvent, this.eventToEdit).subscribe({
      next: (updatedEvent) => {
        // Update the specific event in the array
        const index = this.events.findIndex(e => e.idEvent === updatedEvent.idEvent);
        if (index !== -1) {
          this.events[index] = updatedEvent;
        }
        
        // Properly close the modal
        const modalElement = document.getElementById('editEventModal');
        if (modalElement) {
          document.activeElement && (document.activeElement as HTMLElement).blur(); // retire le focus

          const modal = bootstrap.Modal.getInstance(modalElement);
          modal?.hide();
          modalElement.removeAttribute('aria-hidden'); // Fix accessibility warning
        }
        
        alert('Événement mis à jour avec succès');
      },
      error: (err) => {
        console.error('Erreur de mise à jour', err);
        alert('Erreur lors de la mise à jour');
      }
    });
  }
}

toggleDetails(event: any): void {
  event.showDetails = !event.showDetails;
}


// Dans la classe EventListComponent
viewParticipants(eventId: number): void {
  this.router.navigate(['/dashboard/event-participants', eventId]);
}


applyFilters(): void {
  this.eventService.filterEvents(this.filters).subscribe();
}

resetFilters(): void {
  this.filters = {};
  this.eventService.loadEvents();
}





toggleFilterExpansion() {
  this.filtersExpanded = !this.filtersExpanded;
}



toggleCalendarView(): void {
  this.showCalendar = true;
  
  // Convert events to FullCalendar format
  this.calendarOptions.events = this.events.map(event => ({
    id: event.idEvent.toString(),
    title: event.nameEvent,
    start: event.dateEvent,
    extendedProps: {
      location: event.lieuEvent,
      description: event.descriptionEvent,
      status: event.statusEvent
    },
    backgroundColor: this.getEventColor(event.statusEvent),
    borderColor: this.getEventColor(event.statusEvent)
  }));
  
  // Show the modal
  setTimeout(() => {
    const modal = new bootstrap.Modal(document.getElementById('calendarModal'));
    modal.show();
  }, 0);
}

private getEventColor(status: string): string {
  switch(status) {
    case 'ACTIF': return '#28a745'; // Green
    case 'ANNULE': return '#dc3545'; // Red
    case 'TERMINE': return '#6c757d'; // Gray
    default: return '#17a2b8'; // Blue
  }
}

handleEventClick(clickInfo: { event: EventApi }): void {
  const eventId = clickInfo.event.id;
  const event = this.events.find(e => e.idEvent.toString() === eventId);
  
  if (event) {
    // Close calendar modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('calendarModal'));
    modal?.hide();
    
    // Scroll to the event in the list
    const element = document.getElementById(`event-${eventId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      
      // Highlight the event temporarily
      element.classList.add('highlight-event');
      setTimeout(() => {
        element.classList.remove('highlight-event');
      }, 3000);
    }
  }
}

}


  




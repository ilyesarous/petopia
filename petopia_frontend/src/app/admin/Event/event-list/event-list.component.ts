import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from 'src/app/services/Event/event.service';
import { AuthService } from 'src/app/services/user/auth.service'; // Importer AuthService
import { Participation } from 'src/app/models/EventModule/participation'; // Assurez-vous que le chemin est correct
import { ParticipationService } from 'src/app/services/Event/participation.service';
import { Event } from 'src/app/models/EventModule/appevent'; // Assurez-vous que le chemin est correct

import { ViewChild, ElementRef } from '@angular/core';


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

  constructor(private eventService: EventService, private router: Router,private authService: AuthService, private participationService: ParticipationService) {}

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

saveUpdatedEvent(): void {
  if (this.eventToEdit) {
    this.eventService.updateEvent(this.eventToEdit.idEvent, this.eventToEdit).subscribe({
      next: () => {
        alert('Événement mis à jour avec succès');
        this.editMode = false;
        this.eventToEdit = null;
        this.eventService.loadEvents();
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







}


  




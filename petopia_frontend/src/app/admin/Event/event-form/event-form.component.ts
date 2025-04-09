import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventService } from 'src/app/services/Event/event.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Event } from 'src/app/models/EventModule/appevent'; // Corrected path

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css']
})
export class EventFormComponent implements OnInit {
  eventForm!: FormGroup;
  userId!: number;
  events: Event[] = [];  // Utilisation du modèle Event
  eventId: number | null = null;  // ID de l'événement à modifier, si présent


  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private router: Router,
    private route: ActivatedRoute  // Pour récupérer les paramètres de l'URL

  ) {}

  ngOnInit(): void {
    this.eventForm = this.fb.group({
      nameEvent: ['', Validators.required],
      descriptionEvent: ['', Validators.required],
      dateEvent: ['', Validators.required],
      lieuEvent: ['', Validators.required],
      lattitudeEvent: [0, Validators.required],
      longitudeEvent: [0, Validators.required],
      prixEvent: [0, Validators.required],
      placesMaxEvent: [1, Validators.required],
      eventType: ['', Validators.required],
      visibiliteEvent: ['', Validators.required],
      statusEvent: ['', Validators.required]
    });

    this.userId = localStorage.getItem('userId')
      ? parseInt(localStorage.getItem('userId')!)
      : 0;

      // Vérifier si un événement doit être modifié
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.eventId = +id;
        this.loadEventForUpdate(this.eventId);
      }
    });

  }

  loadEventForUpdate(eventId: number): void {
    // Charger les détails de l'événement existant
    this.eventService.getEventById(eventId).subscribe((eventData: Event) => {
      // Remplir le formulaire avec les données de l'événement
      this.eventForm.patchValue({
        nameEvent: eventData.nameEvent,
        descriptionEvent: eventData.descriptionEvent,
        dateEvent: eventData.dateEvent,
        lieuEvent: eventData.lieuEvent,
        lattitudeEvent: eventData.lattitudeEvent,
        longitudeEvent: eventData.longitudeEvent,
        prixEvent: eventData.prixEvent,
        placesMaxEvent: eventData.placesMaxEvent,
        eventType: eventData.eventType,
        visibiliteEvent: eventData.visibiliteEvent,
        statusEvent: eventData.statusEvent
      });
    }, (error) => {
      console.error('Erreur lors du chargement de l\'événement:', error);
      alert("Erreur lors du chargement de l'événement.");
    });
  }

  onSubmit(): void {
    if (this.eventForm.valid) {
      const formData = this.eventForm.value;
      formData.organisateur = { id_user: this.userId };  // Ajout de l'ID de l'utilisateur

      if (this.eventId) {
        // Si un événement existe déjà, on met à jour
        this.eventService.updateEvent(this.eventId, formData).subscribe(
          () => {
            alert('Événement mis à jour avec succès !');
            this.router.navigate(['dashboard/events']);
          },
          (error) => {
            console.error('Erreur lors de la mise à jour de l\'événement:', error);
            alert('Erreur lors de la mise à jour de l\'événement.');
          }
        );
      } else {
        // Si c'est un nouvel événement, on l'ajoute
        this.eventService.addEvent(formData).subscribe(
          () => {
            alert('Événement ajouté avec succès !');
            this.router.navigate(['dashboard/events']);
          },
          (error) => {
            console.error('Erreur lors de l\'ajout de l\'événement :', error);
            alert("Erreur lors de l'ajout de l'événement.");
          }
        );
      }
    }
  }
}

  
  



  
  
 

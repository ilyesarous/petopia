
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventService } from 'src/app/services/Event/event.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Event } from 'src/app/models/EventModule/appevent';
import { Location } from '@angular/common';  // Importer Location


@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css']
})
export class EventFormComponent implements OnInit {
  eventForm!: FormGroup;
  userId!: number;
  events: Event[] = [];
  eventId: number | null = null;
  minDate: string;

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location

  ) {
    // Set minimum date to today
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.eventForm = this.fb.group({
      nameEvent: ['', Validators.required],
      descriptionEvent: ['', Validators.required],
      dateEvent: ['', [
        Validators.required,
        this.futureDateValidator.bind(this)
      ]],
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

  // Custom validator for future dates
  futureDateValidator(control: any): { [key: string]: boolean } | null {
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      return { 'pastDate': true };
    }
    return null;
  }

  loadEventForUpdate(eventId: number): void {
    // Charger les détails de l'événement existant
    this.eventService.getEventById(eventId).subscribe((eventData: Event) => {
      // Remplir le formulaire avec les données de l'événement
      this.eventForm = this.fb.group({
        nameEvent: ['', Validators.required],
        descriptionEvent: ['', Validators.required],
        dateEvent: ['', Validators.required],
        lieuEvent: ['', Validators.required],
        lattitudeEvent: [0, [Validators.required, Validators.min(-90), Validators.max(90)]],
        longitudeEvent: [0, [Validators.required, Validators.min(-180), Validators.max(180)]],
        prixEvent: [0, [Validators.required, Validators.min(0)]],
        placesMaxEvent: [1, [Validators.required, Validators.min(1)]],
        eventType: ['', Validators.required],
        visibiliteEvent: ['', Validators.required],
        statusEvent: ['', Validators.required]
      });
    }, (error) => {
      console.error('Erreur lors du chargement de l\'événement:', error);
      alert("Erreur lors du chargement de l'événement.");
    });
  }

  onSubmit(): void {
    if (this.eventForm.valid) {
      const formData = this.eventForm.value;
      formData.organisateur = { id_user: this.userId };

      if (this.eventId) {
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
    } else {
      // Mark all fields as touched to show validation messages
      this.markFormGroupTouched(this.eventForm);
    }
  }
  // Helper method to mark all form controls as touched
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
  //Méthode pour revenir en arrière
  goBack(): void {
    this.location.back();  // Effectue un retour en arrière dans l'historique de navigation
  }
}

  
  



  
  
 

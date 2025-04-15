import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ParticipationService } from 'src/app/services/Event/participation.service';
import { Participation, ParticipationStatus } from 'src/app/models/EventModule/participation';
import { Event as AppEvent } from 'src/app/models/EventModule/appevent'; // Assurez-vous que le chemin est correct
import { ActivatedRoute, Router } from '@angular/router'; // ← Assure-toi que c’est bien importé
import { AuthService } from 'src/app/services/user/auth.service';
import { Location } from '@angular/common';  // Importer Location
import { EventService } from 'src/app/services/Event/event.service';


@Component({
  selector: 'app-participation-form',
  templateUrl: './participation-form.component.html',
  styleUrls: ['./participation-form.component.css']
})
export class ParticipationFormComponent {
    // Participation modèle initialisé avec des valeurs par défaut
  participation: Participation = {
    dateInscription: new Date(),
    event: { idEvent: 1 } as any, // à remplacer dynamiquement selon le cas
    participant: { idUser: 1 } as any, // idem
    statusParticipation: ParticipationStatus.PENDING
  };

  eventDetails: AppEvent | null = null; // Ajoutez cette ligne pour stocker les détails de l'événement
  alreadyParticipating: boolean = false;


  @Input() eventP: AppEvent | null = null; // L'événement reçu du parent
  @Output() close = new EventEmitter<void>(); // Pour fermer le formulaire
  userId: number = 0;
  idEvent: number = 0;
  role: string = '';
  
  constructor(private participationService: ParticipationService,
    private route: ActivatedRoute,  
    private authService: AuthService,
    private location: Location, 
    private router: Router,  
    private eventService: EventService

  ) {

  }
  
  // Méthode pour revenir en arrière
  goBack(): void {
    this.location.back();  // Effectue un retour en arrière dans l'historique de navigation
  }
  ngOnInit(): void {
    this.idEvent = Number(this.route.snapshot.paramMap.get('id'));
    // this.participation.event = { idEvent } as any;
    console.log('ID de l\'événement récupéré via route :', this.idEvent);

    this.userId = Number(localStorage.getItem('userId'));

    // Affecter l'event sélectionné
    this.participation.event = { idEvent: this.idEvent } as any;
    this.participation.participant = { id_user: this.userId } as any;

    // Ajoutez ceci pour récupérer les détails de l'événement
    this.eventService.getEventById(this.idEvent).subscribe({
      next: (event) => {
        this.eventDetails = event;
        this.participation.event = event; // Mettez à jour l'événement dans la participation
         // Vérifier si l'utilisateur participe déjà
         this.checkExistingParticipation();
        },
      error: (err) => console.error('Erreur lors du chargement de l\'événement', err)
    });

  

    // Appeler le service pour obtenir les détails du participant
    // this.authService.getUserById(userId).subscribe({
    //   next: user => {
    //     this.participation.participant = user;
    //   },
    //   error: err => console.error('Erreur lors du chargement du participant', err)
    // });
  
  }

  
  checkExistingParticipation(): void {
    this.participationService.checkUserParticipation(this.userId, this.idEvent).subscribe({
      next: (exists) => {
        this.alreadyParticipating = exists;
      },
      error: (err) => console.error('Error checking participation', err)
    });
  }

  // ngOnChanges(): void {
    

  //   if (this.eventP) {
  //     this.participation.event = {
  //       idEvent: this.eventP.idEvent,
  //     } as any; // Tu peux remplacer `as any` si tu as un bon typage
  //   }


  // }


  onSubmit(): void {
    if (this.alreadyParticipating) {
      alert('You are already registered for this event');
      return;
    }
    console.log('Formulaire soumis');
  
    // D'abord décrémenter le nombre de places
    this.eventService.decrementPlaces(this.idEvent).subscribe({
      next: () => {
        // Ensuite ajouter la participation
        this.participationService.addParticipation(this.participation).subscribe({
          next: res => {

            console.log('Participation ajoutée !', res);
                    // Redirection vers la liste des participations
            this.router.navigate(['/participations']);
          },
          error: err => {
            console.error('Erreur lors de l\'ajout de la participation', err);
          }
        });
      },
      error: err => {
        console.error('Erreur lors de la décrémentation des places', err);
        alert('Plus de places disponibles pour cet événement');
      }
    });



  }


  // Ajoutez cette méthode si elle n'existe pas
onClose(): void {
  console.log('Bouton fermer cliqué'); // Pour vérifier que le clic est bien détecté
  this.close.emit();
}
}

 


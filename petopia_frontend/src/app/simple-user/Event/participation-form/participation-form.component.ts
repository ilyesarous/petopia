import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ParticipationService } from 'src/app/services/Event/participation.service';
import { Participation, ParticipationStatus } from 'src/app/models/EventModule/participation';
import { Event as AppEvent } from 'src/app/models/EventModule/appevent'; // Assurez-vous que le chemin est correct
import { ActivatedRoute } from '@angular/router'; // ← Assure-toi que c’est bien importé
import { AuthService } from 'src/app/services/user/auth.service';

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

  @Input() eventP: AppEvent | null = null; // L'événement reçu du parent
  @Output() close = new EventEmitter<void>(); // Pour fermer le formulaire
  userId: number = 0;
  idEvent: number = 0;
  role: string = '';
  
  constructor(private participationService: ParticipationService,private route: ActivatedRoute,  private authService: AuthService) {

  }

  ngOnInit(): void {
    this.idEvent = Number(this.route.snapshot.paramMap.get('id'));
    // this.participation.event = { idEvent } as any;
    console.log('ID de l\'événement récupéré via route :', this.idEvent);

    this.userId = Number(localStorage.getItem('userId'));

    // Affecter l'event sélectionné
    this.participation.event = { idEvent: this.idEvent } as any;
    this.participation.participant = { id_user: this.userId } as any;

    // Appeler le service pour obtenir les détails du participant
    // this.authService.getUserById(userId).subscribe({
    //   next: user => {
    //     this.participation.participant = user;
    //   },
    //   error: err => console.error('Erreur lors du chargement du participant', err)
    // });
  
  }

  // ngOnChanges(): void {
    

  //   if (this.eventP) {
  //     this.participation.event = {
  //       idEvent: this.eventP.idEvent,
  //     } as any; // Tu peux remplacer `as any` si tu as un bon typage
  //   }


  // }


  onSubmit(): void {
    console.log('Formulaire soumis');

    if (this.eventP) {
      this.participation.event = { ...this.eventP } as any; // S'assurer que l'événement est correct
    }

    // Appeler le service pour enregistrer la participation
    this.participationService.addParticipation(this.participation).subscribe({
      next: res => {
        console.log('Participation ajoutée !', res);
        // Fermer le formulaire après ajout réussi
        this.close.emit();
      },
      error: err => {
        console.error('Erreur lors de l\'ajout de la participation', err);
      }
    });
  }
  
}

 


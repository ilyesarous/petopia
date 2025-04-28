import { Event } from 'src/app/models/EventModule/appevent'; // Assure-toi que le chemin est correct

export enum ParticipationStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELED = 'CANCELLED'
    

}


export interface Participation {
    isPaying?: boolean;
    idParticipation?: number;
    dateInscription: Date;
    event: Event;                      // L'événement auquel on participe
    participant: any; // Objet simplifié aussi
    statusParticipation: ParticipationStatus;
    timeRemaining?: number; // ajoutez cette propriété
    paid?: boolean; // Add this
    


  }
  
  
 
  
  
  
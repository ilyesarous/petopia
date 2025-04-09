import { Event } from 'src/app/models/EventModule/appevent'; // Assure-toi que le chemin est correct

export enum ParticipationStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELED = 'CANCELED'
}


export interface Participation {
    idParticipation?: number;
    dateInscription: Date;
    event: Event;                      // L'événement auquel on participe
    participant: any; // Objet simplifié aussi
    statusParticipation: ParticipationStatus;
  }
  
  
 
  
  
  
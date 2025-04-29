import { Participation } from "./participation";

export interface Event {
    idEvent: number;
    nameEvent: string;
    descriptionEvent: string;
    dateEvent: Date;
    lieuEvent: string;
    lattitudeEvent: number;
    longitudeEvent: number;
    prixEvent: number;
    placesMaxEvent: number;
    availablePlaces: number;
    eventType: string; 
    visibiliteEvent: string;
    statusEvent: string;
    organisateur?: any; 
    participations?: Participation[]; 
    generatedImageUrl?: string; 


  }
  
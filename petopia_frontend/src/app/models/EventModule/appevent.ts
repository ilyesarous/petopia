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
    eventType: string; // ou enum si tu veux
    visibiliteEvent: string;
    statusEvent: string;
    organisateur?: any; // tu peux typifier ça plus tard si besoin
    participations?: Participation[]; // Add this line

  }
  
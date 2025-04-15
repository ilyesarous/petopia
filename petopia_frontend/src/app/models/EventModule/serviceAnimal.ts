// src/app/models/service-animal.model.ts

export enum ServiceType {
    DOG_SITTING = 'DOG_SITTING',
    PROMONADE='PROMONADE',
    DOG_WALKING='DOG_WALKING',
  // Add any other types you have in your Enum
}

export interface ReservationService {
  // Define properties here if needed, or import from another model
  // Example:
  // idReservation: number;
  // dateReservation: Date;
  // ...
}

export interface ServiceAnimal {
  idServiceAnimal: number;
  prixServiceAnimal: number;
  descriptionServiceAnimal: string;
  disponibilite: boolean;
  typeService: ServiceType;
  reservations?: ReservationService[]; // Optional if you're not always returning it
  organisateurServiceAnimal?: any; // Add this line

}
export function getServiceTypeClass(type: ServiceType): string {
  return type.toString();
}

export function getServiceTypes(): string[] {
  return Object.values(ServiceType);
}
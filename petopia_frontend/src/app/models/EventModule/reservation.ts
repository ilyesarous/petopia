// src/app/models/EventModule/reservation.model.ts
export interface Reservation {
    id?: number;
    serviceAnimal: any ;
    utilisateur: any;
    reservationDate: Date;
    
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
    specialRequests?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }
// src/app/models/matching/pet.ts
export interface Pet {
  idPet: number;
  petName: string;
  petImage?: string; // Optional, matches Match and FriendWithPets
  breed?: string;    // Optional, from FriendWithPets
  user?: {
    id_user: number;
    name?: string;   // From FriendWithPets
    email?: string;  // From Match
  };
}
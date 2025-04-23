// src/app/models/matching/match.ts
import { Pet } from './pet';

export interface Match {
  id_match: number;
  pet_1: Pet;
  pet_2: Pet;
  compatibilite: boolean;
  status: 'PENDING' | 'ACCEPTED' | string;
}

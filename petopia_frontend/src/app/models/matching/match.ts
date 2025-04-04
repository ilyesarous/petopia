// src/app/models/match.ts
export class Match {
    id_match!: number;
    pet_1!: {
      idPet: number;
      petName: string;
    };
    pet_2!: {
      idPet: number;
      petName: string;
    };
    compatibilite!: boolean;
    status!: string; // ou utilisez une enum si vous avez une liste fixe de statuts
  }
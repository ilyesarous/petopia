export interface FriendWithPets {
    user: {
      id_user: number;
      name: string; // Ajoute d'autres champs si nécessaire
    };
    matchedPets: {
      idPet: number;
      petName: string;
      breed: string;
      petImage: string;
    }[];
  }
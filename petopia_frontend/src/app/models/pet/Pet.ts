import { Shelter } from "../adoption/shelter/Shelter";

export class Pet {
    idPet!: number;
    petName!: string;
    petAge!: number;
    petImage!: string;
    breed!: string;
    location!: string;
    attitudeX!: number;
    attitudeY!: number;
    species!: string;    // e.g., "DOG", "CAT"
    status!: string;    // e.g., "AVAILABLE", "ADOPTED", etc.
    gender!: string;     // e.g., "MALE", "FEMALE"
    size!: string;       // e.g., "SMALL", "MEDIUM", "LARGE"
    healthStatus!: string[]; 
    shelter?: Shelter;
    }
  
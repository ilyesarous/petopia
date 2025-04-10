import { Pet } from "../../pet/Pet";
import { Shelter } from "../shelter/Shelter";
import { Adoption } from "./Adoption";
export class User {
    id_user!: number;
    name!: string;
    phoneNumber!: string;
    email!: string;
    password?: string; 
    locked?: boolean;
    role!: string; 
    nb_points?: number;
  }
export interface AdoptionCertificate {
    id_certificate: number;
    user: User;
    pet: Pet;
    shelter: Shelter;
    issued_date: string;
    user_signature?: string;
    shelter_signature?: string;
    adoption?: Adoption;
  }
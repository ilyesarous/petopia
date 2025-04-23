import { Pet } from "../../pet/Pet";
import { Shelter } from "../shelter/Shelter";
export class User {
  id_user!: number;
  name!: string;
  phoneNumber!: string;
  email!: string;
  password?: string; // Usually omitted when sent to frontend
  locked?: boolean;
  role!: string; // e.g., 'USER', 'ADMIN', etc.
  nb_points?: number;
}
export class Adoption {
  id_request!: number;
  pet!: Pet;
  requester!: User;
  shelter?: Shelter;
  request_date?: string; 
  status?: string; 
  cinimage?: string;
  motivation_letter?: string;  
}

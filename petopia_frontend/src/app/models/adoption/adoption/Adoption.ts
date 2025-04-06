export class Adoption {
    id_request?: number;
    pet!: {
      idPet: number;
    };
    requester?: {
      id_user: number;
      name?: string;
      email?: string;
   };
    shelter?: {
      id_shelter: number;
      shelter_name?: string;
    };
    request_date?: string; 
    status?: string; 
    cinimage?: string;
    // Optionally add adoptionCertificate if needed:
    // adoptionCertificate?: any;
  }
  
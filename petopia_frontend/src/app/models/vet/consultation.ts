export class Consultation {
    idConsultation!: number;
    consultation_date!: string;
    start_time!: string;
    end_time!: string;
    consultationT!: string;
    consultation_price!: number;
    statusT!: string;
    userclient!: User;
    uservet!: User;
    petconsultation!: Pet;
  }
  
  export class User {
    id_user!: number;
    name!: string;
    email!: string;
    role!: string;
  }
  
  export class Pet {
    idPet!: number;
    petName!: string;
    breed! : string;
    imageUrl?: string;
  }
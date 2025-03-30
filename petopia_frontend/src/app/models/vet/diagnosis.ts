export class Diagnosis {
    idDiagnosis!: number;
    diagnosis_description!: string;
    diagnosis_date!: string;
    diagnosisT!: string;
    medicamentPrescriptions!: Medicament_Prescription[];
    petdiagnosis!: Pet;
  }
  
  export class Medicament_Prescription {
    idMedicament_Prescription!: number;
    medicament!: string;
  }
  
  export class Pet {
    idPet!: number;
    petName!: string;
    breed! : string;
  }
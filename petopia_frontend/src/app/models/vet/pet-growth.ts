export class PetGrowth { 
    idPet_Growth!: number;
    weight!: number;
    height!: number;
    health_status!: string;
    measurement_date!: string;
    petgrowth!: Pet;
  }
  
  export class Pet {
    idPet!: number;
    petName!: string;
    breed! : string;
  }
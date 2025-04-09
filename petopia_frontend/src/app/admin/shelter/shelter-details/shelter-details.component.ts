import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Shelter } from 'src/app/models/adoption/shelter/Shelter';
import { Pet } from 'src/app/models/pet/Pet';
import { ShelterService } from 'src/app/services/adoptions/shelter/shelter.service';
import { PetService } from 'src/app/services/pets/pet.service';

@Component({
  selector: 'app-shelter-details',
  templateUrl: './shelter-details.component.html',
  styleUrls: ['./shelter-details.component.css']
})
export class ShelterDetailsComponent implements OnInit {
  shelter!: Shelter;
  pets: Pet[] = [];
  shelterId!: number;

  totalPets = 0;
  adoptedPets = 0;
  availablePets = 0;
  pendingRequests = 0;

  constructor(
    private route: ActivatedRoute,
    private shelterService: ShelterService,
    private petService: PetService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.shelterId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadShelterDetails(this.shelterId);
  }

  loadShelterDetails(id: number) {
    this.shelterService.getShelterById(id).subscribe((shelter) => {
      this.shelter = shelter;
    });

    this.petService.getPetsByShelterId(id).subscribe((pets) => {
      this.pets = pets;
      this.totalPets = pets.length;
      this.adoptedPets = pets.filter(p => p.status === 'ADOPTED').length;
      this.availablePets = pets.filter(p => p.status === 'AVAILABLE').length;
      this.pendingRequests = pets.filter(p => p.status === 'PENDING').length;
    });
  }

  showSuccessAlert: boolean = false;
  showErrorAlert: boolean = false;
  deleteShelter(): void {
    if (confirm('Are you sure you want to delete this shelter?')) {
      this.shelterService.deleteShelter(this.shelterId).subscribe({
        next: () => {
          this.showSuccessAlert = true;
          this.showErrorAlert = false;
  
          setTimeout(() => {
            this.showSuccessAlert = false;
            this.router.navigate(['/dashboard/shelters']);
          }, 1000);
        },
        error: (err) => {
          console.error('Error deleting shelter:', err);
          this.showErrorAlert = true;
          this.showSuccessAlert = false;
  
          setTimeout(() => {
            this.showErrorAlert = false;
          }, 1000);
        }
      });
    }
  }
  

}

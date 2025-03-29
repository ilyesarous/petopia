import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Pet } from 'src/app/models/pet/Pet';
import { PetService } from 'src/app/services/pets/pet.service';
import { faPaw, faHeart, faHandHoldingHeart, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-pet-adopt-details',
  templateUrl: './pet-adopt-details.component.html',
  styleUrls: ['./pet-adopt-details.component.css']
})
export class PetAdoptDetailsComponent implements OnInit {
  faPaw = faPaw;
  faHeart = faHeart;
  faHandHoldingHeart = faHandHoldingHeart;
  faInfoCircle = faInfoCircle;
  pet: Pet | null = null;

  constructor(
    private route: ActivatedRoute,
    private petService: PetService
  ) {}

  ngOnInit(): void {
    const petId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadPetDetails(petId);
  }

  loadPetDetails(id: number) {
    this.petService.getPetById(id).subscribe({
      next: (data) => (this.pet = data),
      error: (err) => console.error('Error loading pet details', err)
    });
  }
}

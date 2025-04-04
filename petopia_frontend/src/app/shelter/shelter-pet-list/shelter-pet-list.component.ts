import { Component } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Shelter } from 'src/app/models/adoption/shelter/Shelter';
import { Pet } from 'src/app/models/pet/Pet';
import { ShelterService } from 'src/app/services/adoptions/shelter/shelter.service';
import { PetService } from 'src/app/services/pets/pet.service';
import { faPaw } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-shelter-pet-list',
  templateUrl: './shelter-pet-list.component.html',
  styleUrls: ['./shelter-pet-list.component.css']
})
export class ShelterPetListComponent {
  pets: Pet[] = [];
  shelter?: Shelter;
  selectedPet!: Pet;
  showEditModal: boolean = false;
  editPetForm!: FormGroup;
  faPaw = faPaw;

  constructor(private petService: PetService, private shelterService : ShelterService, private fb: FormBuilder) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('No userId found in localStorage');
      return;
    }

    this.shelterService.getShelterByUserId(+userId).subscribe({
      next: (shelterData) => {
        this.shelter = shelterData;
        if (this.shelter.id_shelter) {
          this.loadPetsByShelterId(this.shelter.id_shelter);
        }
      },
      error: (err) => {
        console.error('Error fetching shelter details:', err);
      }
    });
  }

  loadPetsByShelterId(shelterId: number): void {
    this.petService.getPetsByShelterId(shelterId).subscribe({
      next: (data) => {
        this.pets = data;
        console.log('Pets by shelter:', this.pets);
      },
      error: (err) => {
        console.error('Error fetching pets:', err);
      }
    });
  }
  deletePet(pet: Pet): void {
    if (confirm(`Are you sure you want to delete ${pet.petName}?`)) {
      this.petService.deletePet(pet.idPet).subscribe({
        next: () => {
          // Remove deleted pet from the list
          this.pets = this.pets.filter(p => p.idPet !== pet.idPet);
          alert('Pet deleted successfully!');
        },
        error: (err) => {
          console.error('Error deleting pet:', err);
          alert('Error deleting pet. Please try again.');
        }
      });
    }
  }
  getStatusClass(status?: string): string {
    switch (status) {
      case 'AVAILABLE':
        return 'tag-available';
      case 'ADOPTED':
        return 'tag-adopted';
      
      default:
        return 'tag-default';
    }
  }
  openEditModal(pet: Pet): void {
    this.selectedPet = pet;
    this.initEditForm();
    this.showEditModal = true;
  }

  initEditForm(): void {
    this.editPetForm = this.fb.group({
      petName: [this.selectedPet.petName, Validators.required],
      breed: [this.selectedPet.breed, Validators.required],
      petAge: [this.selectedPet.petAge, [Validators.required, Validators.min(0)]],
      species: [this.selectedPet.species, Validators.required],
      gender: [this.selectedPet.gender, Validators.required],
      size: [this.selectedPet.size, Validators.required],
      healthStatus: [this.selectedPet.healthStatus],
    });
  }

  closeEditModal(): void {
    this.showEditModal = false;
  }

  onEditSubmit(): void {
    if (this.editPetForm.invalid) {
      return;
    }
    const updatedPet: Pet = {
      ...this.selectedPet,
      ...this.editPetForm.value
    };
    this.petService.updatePet(updatedPet.idPet, updatedPet).subscribe({
      next: (res) => {
        // Update the pet list with the new values
        const index = this.pets.findIndex(p => p.idPet === res.idPet);
        if (index !== -1) {
          this.pets[index] = res;
        }
        this.showEditModal = false;
        alert('Pet information updated successfully!');
      },
      error: (err) => {
        console.error('Error updating pet:', err);
        alert('Error updating pet. Please try again.');
      }
    });
  }
}
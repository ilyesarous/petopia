import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  paginatedPets: Pet[] = [];
  currentPage = 1;
  itemsPerPage = 6;

  shelter?: Shelter;
  selectedPet!: Pet;
  showEditModal = false;
  editPetForm!: FormGroup;
  faPaw = faPaw;

  // Bootstrap Alert
  alertMessage: string = '';
  alertClass: string = '';

  constructor(
    private petService: PetService,
    private shelterService: ShelterService,
    private fb: FormBuilder
  ) {}

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
      error: (err) => console.error('Error fetching shelter details:', err)
    });
  }

  loadPetsByShelterId(shelterId: number): void {
    this.petService.getPetsByShelterId(shelterId).subscribe({
      next: (data) => {
        this.pets = data;
        this.updatePaginatedPets();
      },
      error: (err) => console.error('Error fetching pets:', err)
    });
  }

  updatePaginatedPets(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedPets = this.pets.slice(start, end);
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.updatePaginatedPets();
  }

  get totalPagesCount(): number {
    return Math.ceil(this.pets.length / this.itemsPerPage);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPagesCount }, (_, i) => i + 1);
  }

  deletePet(pet: Pet): void {
    if (confirm(`Are you sure you want to delete ${pet.petName}?`)) {
      this.petService.deletePet(pet.idPet).subscribe({
        next: () => {
          this.pets = this.pets.filter(p => p.idPet !== pet.idPet);
          this.updatePaginatedPets();
          this.showAlert('Pet deleted successfully!', 'success');
        },
        error: (err) => {
          const alreadyInRequest = err.status === 409 || err.error?.message?.includes('adoption');
          const errorMessage = alreadyInRequest
            ? 'This pet is already part of an adoption request and cannot be deleted.'
            : 'This pet is already part of an adoption request and cannot be deleted.';
          this.showAlert(errorMessage, 'danger');
        }
      });
    }
  }

  showAlert(message: string, type: 'success' | 'danger') {
    this.alertMessage = message;
    this.alertClass = type === 'success' ? 'alert alert-success' : 'alert alert-danger';
    setTimeout(() => {
      this.alertMessage = '';
      this.alertClass = '';
    }, 4000);
  }

  getStatusClass(status?: string): string {
    switch (status) {
      case 'AVAILABLE': return 'tag-available';
      case 'ADOPTED': return 'tag-adopted';
      default: return 'tag-default';
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
    if (this.editPetForm.invalid) return;

    const updatedPet: Pet = {
      ...this.selectedPet,
      ...this.editPetForm.value
    };

    this.petService.updatePet(updatedPet.idPet, updatedPet).subscribe({
      next: (res) => {
        const index = this.pets.findIndex(p => p.idPet === res.idPet);
        if (index !== -1) this.pets[index] = res;
        this.updatePaginatedPets();
        this.showEditModal = false;
        this.showAlert('Pet updated successfully!', 'success');
      },
      error: (err) => {
        console.error('Error updating pet:', err);
        this.showAlert('Update failed. Try again.', 'danger');
      }
    });
  }
}

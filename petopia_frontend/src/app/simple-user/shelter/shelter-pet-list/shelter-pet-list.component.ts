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
  filteredPets: Pet[] = [];
  paginatedPets: Pet[] = [];

  currentPage = 1;
  itemsPerPage = 6;

  searchQuery: string = '';
  statusFilter: 'ALL' | 'AVAILABLE' | 'ADOPTED' = 'ALL';

  shelter?: Shelter;
  selectedPet!: Pet;
  showEditModal = false;
  editPetForm!: FormGroup;
  faPaw = faPaw;

  alertMessage: string = '';
  alertClass: string = '';
  showAddModal = false;
  addPetForm!: FormGroup;
  selectedImage: File | null = null;
  editImageFile: File | null = null;
  editImagePreviewUrl: string | ArrayBuffer | null = null;
  imagePreviewUrl: string | ArrayBuffer | null = null;

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
        this.pets = data.reverse();
        this.applyFilters();
      },
      error: (err) => console.error('Error fetching pets:', err)
    });
  }

  applyFilters(): void {
    const query = this.searchQuery.toLowerCase();

    this.filteredPets = this.pets.filter(pet => {
      const matchesSearch = [
        pet.petName,
        pet.breed,
        pet.species,
        pet.gender,
        pet.healthStatus,
        pet.size,
        pet.status
      ].some(field => field?.toLowerCase().includes(query));

      const matchesStatus = this.statusFilter === 'ALL' || pet.status === this.statusFilter;

      return matchesSearch && matchesStatus;
    });

    this.currentPage = 1;
    this.updatePaginatedPets();
  }

  updatePaginatedPets(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedPets = this.filteredPets.slice(start, end);
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.updatePaginatedPets();
  }

  get totalPagesCount(): number {
    return Math.ceil(this.filteredPets.length / this.itemsPerPage);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPagesCount }, (_, i) => i + 1);
  }

  deletePet(pet: Pet): void {
    if (confirm(`Are you sure you want to delete ${pet.petName}?`)) {
      this.petService.deletePet(pet.idPet).subscribe({
        next: () => {
          this.pets = this.pets.filter(p => p.idPet !== pet.idPet);
          this.applyFilters();
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
    }, 1000);
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
    this.editImageFile = null;
    this.editImagePreviewUrl = null;
    this.initEditForm();
    this.showEditModal = true;
  }

  initEditForm(): void {
    this.editPetForm = this.fb.group({
      petName: [this.selectedPet.petName,[Validators.required, Validators.minLength(2)]],
      breed: [this.selectedPet.breed, [Validators.required, Validators.minLength(2), Validators.max(20)]],
      petAge: [this.selectedPet.petAge, [Validators.required, Validators.min(1)]],
      species: [this.selectedPet.species, Validators.required],
      gender: [this.selectedPet.gender, Validators.required],
      size: [this.selectedPet.size, Validators.required],
      healthStatus: [this.selectedPet.healthStatus,[Validators.required, Validators.maxLength(50)]],
    });
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.editImageFile = null;
    this.editImagePreviewUrl = null;
  }

  onEditImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.editImageFile = file;
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const result = e.target?.result;
        if (result !== undefined) {
          this.editImagePreviewUrl = result;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  onEditSubmit(): void {
    if (this.editPetForm.invalid) return;

    const updatedPet = {
      ...this.selectedPet,
      ...this.editPetForm.value
    };

    const formData = new FormData();
    formData.append('petData', JSON.stringify(updatedPet));

    if (this.editImageFile) {
      formData.append('image', this.editImageFile);
    }

    this.petService.updatePetWithImage(updatedPet.idPet, formData).subscribe({
      next: () => {
        this.loadPetsByShelterId(this.shelter!.id_shelter!);
        this.closeEditModal();
        this.showAlert('Pet updated successfully!', 'success');
      },
      error: (err) => {
        console.error('Error updating pet:', err);
        this.showAlert('Update failed. Try again.', 'danger');
      }
    });
  }

  openAddModal(): void {
    this.initAddForm();
    this.showAddModal = true;
  }

  closeAddModal(): void {
    this.showAddModal = false;
    this.selectedImage = null;
    this.imagePreviewUrl = null;
  }

  initAddForm(): void {
    this.addPetForm = this.fb.group({
      petName: ['',[Validators.required, Validators.minLength(2)]],
      breed: ['', [Validators.required, Validators.minLength(2), Validators.max(20)]],
      petAge: [0, [Validators.required, Validators.min(1)]],
      species: ['', Validators.required],
      gender: ['', Validators.required],
      size: ['', Validators.required],
      healthStatus: ['',[Validators.required, Validators.maxLength(50)]],
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;

      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const result = e.target?.result;
        if (result !== undefined) {
          this.imagePreviewUrl = result;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  onAddSubmit(): void {
    if (this.addPetForm.invalid || !this.selectedImage) return;

    const formData = new FormData();
    const petData = { ...this.addPetForm.value };

    formData.append('image', this.selectedImage);
    formData.append('petData', JSON.stringify(petData));

    this.petService.addPetForShelter(formData).subscribe({
      next: () => {
        this.closeAddModal();
        this.loadPetsByShelterId(this.shelter!.id_shelter!);
        this.showAlert('Pet added successfully!', 'success');
      },
      error: (err) => {
        console.error('Add failed:', err);
        this.showAlert('Failed to add pet.', 'danger');
      }
    });
  }
}

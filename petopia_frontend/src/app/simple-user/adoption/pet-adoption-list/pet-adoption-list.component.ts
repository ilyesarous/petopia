import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Pet } from 'src/app/models/pet/Pet';
import { PetService } from 'src/app/services/pets/pet.service';
import { faLightbulb } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-pet-adoption-list',
  templateUrl: './pet-adoption-list.component.html',
  styleUrls: ['./pet-adoption-list.component.css']
})
export class PetAdoptionListComponent implements OnInit {
  pets: Pet[] = [];
  filteredPets: Pet[] = [];
  faLightbulb = faLightbulb;

  // For filters
  searchTerm: string = '';
  selectedSpecies: string = '';
  selectedLocation: string = '';
  distinctLocations: string[] = [];


  //pagination
  petsPerPage: number = 6;
  currentPage: number = 1;
  totalPages: number = 1;
  pageNumbers: number[] = [];
  userId:number=0;

  constructor(private petService: PetService, private router: Router, private route: ActivatedRoute) {}
  ngOnInit(): void {
    const storedId = localStorage.getItem('userId');
    this.userId = storedId ? +storedId : 0; 
    console.log(this.userId);
    this.loadUnassignedPets();


  }

  loadUnassignedPets(): void {
    console.log(this.userId);

    this.petService.getUnassignedPets(this.userId).subscribe({
      next: (data: Pet[]) => {
        this.pets = data;
        this.applyFilters(); 
        this.distinctLocations = Array.from(
          new Set(
            data
              .map(p => this.getRegion(p.shelter?.location || ''))
              .filter(loc => loc) // remove null/empty
          )
        ).sort();
              },
      error: (err) => console.error('Error loading unassigned pets', err)
    });
  }

  applyFilters(): void {
    const term = this.searchTerm.toLowerCase();
  
    const filtered = this.pets.filter((pet) => {
      const matchesSearch = pet.petName?.toLowerCase().includes(term)
        || pet.breed?.toLowerCase().includes(term);
  
      const matchesSpecies = !this.selectedSpecies
        || (pet.species && pet.species.toLowerCase() === this.selectedSpecies);
  
      const matchesLocation = !this.selectedLocation
        || (this.getRegion(pet.shelter?.location || '').toLowerCase() === this.selectedLocation.toLowerCase());
  
      return matchesSearch && matchesSpecies && matchesLocation;
    });
  
    this.totalPages = Math.max(1, Math.ceil(filtered.length / this.petsPerPage));
    this.pageNumbers = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  
    // If current page is now invalid, reset to 1
    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }
  
    const start = (this.currentPage - 1) * this.petsPerPage;
    const end = start + this.petsPerPage;
    this.filteredPets = filtered.slice(start, end);
  }
  
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.applyFilters();
    }
  }

  goToDetails(id: number) {
    this.router.navigate(['adoption/pets', id])
      .then(success => {
        if (!success) {
          console.error('Navigation failed');
        }
      });
  }
  goToDreamPetPage(): void {
    this.router.navigate(['/adoption/dream-pet']);
  }
  getRegion(location: string): string {
    if (!location) return '';
    const parts = location.split(',').map(p => p.trim());
  
    for (let i = parts.length - 1; i >= 0; i--) {
      if (
        parts[i] &&
        parts[i].toLowerCase() !== 'tunisia' &&
        !/^\d{4,}$/.test(parts[i]) &&
        !parts[i].includes('معتمدية') 
      ) {
        return parts[i];
      }
    }
    return '';
  }
  
  
}

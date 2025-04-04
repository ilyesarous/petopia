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

  constructor(private petService: PetService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.loadUnassignedPets();
  }

  loadUnassignedPets(): void {
    this.petService.getUnassignedPets().subscribe({
      next: (data: Pet[]) => {
        this.pets = data;
        this.filteredPets = data;
        // Build a unique list of locations for the dropdown
        this.distinctLocations = Array.from(new Set(data.map(p => p.location))).filter(loc => loc);
      },
      error: (err) => console.error('Error loading unassigned pets', err)
    });
  }

  applyFilters(): void {
    const term = this.searchTerm.toLowerCase();

    this.filteredPets = this.pets.filter((pet) => {
      // Search match: name or breed
      const matchesSearch = pet.petName?.toLowerCase().includes(term)
                        || pet.breed?.toLowerCase().includes(term);

      // Species match
      const matchesSpecies = !this.selectedSpecies 
                          || (pet.species && pet.species.toLowerCase() === this.selectedSpecies);

      // Location match
      const matchesLocation = !this.selectedLocation 
                           || (pet.location && pet.location.toLowerCase() === this.selectedLocation.toLowerCase());

      return matchesSearch && matchesSpecies && matchesLocation;
    });
  }

  goToDetails(id: number) {
    this.router.navigate(['home/adoption/pets', id])
      .then(success => {
        if (!success) {
          console.error('Navigation failed');
        }
      });
  }
  goToDreamPetPage(): void {
    this.router.navigate(['/dream-pet']);
  }
}

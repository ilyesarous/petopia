import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PetService } from 'src/app/services/matchingService/pet.service';
import { MatchsService } from 'src/app/services/matchingService/matchs.service';
import { Match } from 'src/app/models/matching/match';

@Component({
  selector: 'app-matching',
  templateUrl: './matching.component.html',
  styleUrls: ['./matching.component.css']
})
export class MatchingComponent implements OnInit {
  isLoading: boolean = true;
  petList: any[] = [];
  selectedPet: any = null;
  showPetDropdown: boolean = false;
  matchingPets: any[] = [];
  showPreferencesForm: boolean = false;
  newPreferences: any = {
    preferred_breed: '',
    min_age: 0,
    max_age: 0,
    preferred_gender: '',
    preferred_location: ''
  };
  currentPreferences: any = null;
  pendingMatches: Match[] = [];
  showPendingMatches: boolean = false;
  notificationCount: number = 0;
  ownerId: number; // Dynamic ownerId

  constructor(
    private petService: PetService,
    private matchsService: MatchsService,
    private router: Router
  ) {
    // Static token from PetService (for testing purposes)
    const staticToken = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqaWhlZGpvb0BnbWFpbC5jb20iLCJyb2xlcyI6WyJST0xFX1VTRVIiXSwidXNlcklkIjoyLCJ1c2VybmFtZSI6ImppaGVkam9vQGdtYWlsLmNvbSIsImlhdCI6MTc0MzY0MTM5OSwiZXhwIjoxNzQzNzI3Nzk5fQ.YkFQqGW9KZRLLvD6S_nuqs9EndHWOfTXOAxtxa5W--c';
    this.ownerId = this.decodeToken(staticToken).userId; // Extract userId from token
  }

  ngOnInit() {
    this.loadUserPets();
    this.loadAllAvailablePets(); // Load all available pets initially
    this.checkPendingMatches();
  }

  // Decode JWT token manually
  private decodeToken(token: string): any {
    try {
      const base64Url = token.split('.')[1]; // Get payload part
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Error decoding token:', e);
      return { userId: null }; // Fallback
    }
  }

  loadUserPets() {
    if (!this.ownerId) {
      console.error('No ownerId available from token');
      this.isLoading = false;
      return;
    }
    this.petService.getPetsByOwnerId(this.ownerId).subscribe({
      next: (data) => {
        this.petList = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading user pets:', err);
        this.isLoading = false;
      }
    });
  }

  loadAllAvailablePets() {
    this.petService.getPetsByStatus('AVAILABLE').subscribe({
      next: (data) => {
        this.matchingPets = data; // Display all available pets initially
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading all available pets:', err);
        this.matchingPets = [];
        this.isLoading = false;
      }
    });
  }

  togglePetDropdown() {
    this.showPetDropdown = !this.showPetDropdown;
  }

  selectPet(pet: any) {
    this.selectedPet = pet;
    this.showPetDropdown = false;
    this.checkPreferences(pet.idPet); // Update display based on selected pet
  }

  checkPreferences(petId: number) {
    this.petService.checkPetPreferences(petId).subscribe({
      next: (response) => {
        if (response.hasPreferences) {
          this.matchingPets = response.matchingPets;
          this.currentPreferences = response.preferences; // Stocker les préférences actuelles
          this.showPreferencesForm = false;
          console.log('Pets compatibles:', this.matchingPets);
          console.log('Préférences actuelles:', this.currentPreferences);
        } else {
          this.matchingPets = [];
          this.currentPreferences = null;
          this.showPreferencesForm = true;
          console.log('Aucune préférence trouvée, formulaire affiché');
        }
      },
      error: (err) => {
        console.error('Erreur lors de la vérification des préférences:', err);
        this.showPreferencesForm = true;
      }
    });
  }

  savePreferences() {
    this.newPreferences.pet = { idPet: this.selectedPet.idPet };
    this.petService.addPreferences(this.newPreferences).subscribe({
      next: (response) => {
        this.showPreferencesForm = false;
        this.checkPreferences(this.selectedPet.idPet); // Rafraîchir
        console.log('Préférences enregistrées:', response);
      },
      error: (err) => {
        console.error('Erreur lors de l’enregistrement des préférences:', err);
      }
    });
  }

  showPreferences() {
    if (this.currentPreferences) {
      this.showPreferencesForm = false; // Afficher les préférences actuelles
    } else {
      this.petService.getPreferencesByPetId(this.selectedPet.idPet).subscribe({
        next: (preferences) => {
          this.currentPreferences = preferences;
          this.showPreferencesForm = false;
          console.log('Préférences récupérées:', preferences);
        },
        error: (err) => {
          console.error('Erreur lors de la récupération des préférences:', err);
          alert('Aucune préférence trouvée pour ce pet.');
        }
      });
    }
  }

  editPreferences() {
    if (this.currentPreferences) {
      this.newPreferences = { ...this.currentPreferences }; // Pré-remplir le formulaire
      this.showPreferencesForm = true; // Afficher le formulaire pour modification
    }
  }

  deletePreferences() {
    console.log('Delete - currentPreferences:', this.currentPreferences);
    if (!this.currentPreferences || !this.currentPreferences.id_preference) {
      alert('No preferences selected to delete');
      console.log('Reason: currentPreferences is', this.currentPreferences);
      return;
    }
    if (confirm('Voulez-vous vraiment supprimer ces préférences ?')) {
      this.petService.deletePreferences(this.currentPreferences.id_preference).subscribe({
        next: () => {
          this.currentPreferences = null;
          this.showPreferencesForm = true;
          this.matchingPets = [];
          console.log('Préférences supprimées avec succès');
          alert('Préférences supprimées avec succès !');
        },
        error: (err) => {
          console.error('Erreur lors de la suppression des préférences:', err);
          alert('Erreur lors de la suppression des préférences: ' + err.message);
        }
      });
    }
  }

  matchPet(match: any) {
    if (!this.selectedPet) {
      alert('Please select a pet before matching.');
      return;
    }

    this.matchsService.createMatch(this.selectedPet.idPet, match.idPet).subscribe({
      next: (response) => {
        alert(`You have matched ${this.selectedPet.petName} with ${match.petName}!`);
        this.checkPreferences(this.selectedPet.idPet);
        this.checkPendingMatches(); // Mettre à jour les matchs en attente après création
      },
      error: (err) => {
        console.error('Error creating match:', err);
        if (err.status === 400) {
          alert('Matching already exists with ' + match.petName + '!');
        } else {
          alert('An error occurred while matching: ' + (err.error || err.message));
        }
      }
    });
  }

  checkPendingMatches() {
    this.matchsService.getPendingMatches().subscribe({
      next: (matches) => {
        this.pendingMatches = matches;
        this.notificationCount = matches.length;
      },
      error: (err) => {
        console.error('Error loading pending matches:', err);
      }
    });
  }

  togglePendingMatches() {
    this.showPendingMatches = !this.showPendingMatches;
  }

  acceptMatch(matchId: number) {
    this.matchsService.acceptMatch(matchId).subscribe({
      next: () => {
        alert('Match accepted successfully!');
        this.checkPendingMatches();
      },
      error: (err) => {
        console.error('Error accepting match:', err);
        alert('Error accepting the match.');
      }
    });
  }

  deleteMatch(matchId: number) {
    if (confirm('Are you sure you want to delete this match?')) {
      this.matchsService.deleteMatch(matchId).subscribe({
        next: () => {
          alert('Match deleted successfully!');
          this.checkPendingMatches();
        },
        error: (err) => {
          console.error('Error deleting match:', err);
          alert('Error deleting the match.');
        }
      });
    }
  }

  viewPetDetails(match: any) {
    if (match && match.idPet) {
      this.router.navigate(['/home/pet-details', match.idPet]);
    } else {
      console.error('Pet ID is missing:', match);
    }
  }

  viewPendingPetDetails(match: any, petType: 'pet_1' | 'pet_2') {
    const pet = match[petType];
    if (pet && pet.idPet) {
      this.router.navigate(['/home/pet-details', pet.idPet]);
    } else {
      console.error(`Pet ID is missing for ${petType}:`, match);
    }
  }
}
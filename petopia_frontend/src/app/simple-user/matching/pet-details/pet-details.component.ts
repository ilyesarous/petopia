import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PetService } from 'src/app/services/matchingService/pet.service';

@Component({
  selector: 'app-pet-details',
  templateUrl: './pet-details.component.html',
  styleUrls: ['./pet-details.component.css']
})
export class PetDetailsComponent implements OnInit {
  pet: any = null;
  isLoading: boolean = true;
  errorMessage: string | null = null; // Add an error message property

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private petService: PetService
  ) {}

  ngOnInit() {
    const petId = this.route.snapshot.paramMap.get('id');
    console.log('Pet ID from URL:', petId);
    if (petId) {
      this.loadPetDetails(+petId); // Convert string to number
    } else {
      console.error('No pet ID provided in URL');
      this.isLoading = false;
      this.errorMessage = 'Invalid pet ID in URL';
    }
  }

  loadPetDetails(petId: number) {
    console.log('Loading pet details for ID:', petId);
    this.petService.getPetById(petId).subscribe({
      next: (data) => {
        console.log('Pet data received:', data);
        if (data) {
          this.pet = data; // Only assign if data exists
        } else {
          console.warn('No pet data returned for ID:', petId);
          this.errorMessage = 'No pet found with this ID';
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading pet details:', err);
        this.errorMessage = err.message || 'Failed to load pet details';
        this.isLoading = false;
      }
    });
  }

  goBack() {
    this.router.navigate(['/home/matchy']);
  }
}
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ImageGenerationService } from 'src/app/services/adoptions/imageGeneration/image-generation.service';
import { forkJoin } from 'rxjs';
import { Pet } from 'src/app/models/pet/Pet';
import { PetService } from 'src/app/services/pets/pet.service';

@Component({
  selector: 'app-dream-pet',
  templateUrl: './dream-pet.component.html',
  styleUrls: ['./dream-pet.component.css']
})
export class DreamPetComponent implements OnInit {
  petDescription: string = '';
  generationLoading: boolean = false;
  imagePath: string = "";
  petsLoading: boolean = false;
  similarPets: (Pet & { similarity?: number })[] = []; // extended to hold similarity
  showRecommendations: boolean = false;
  userId: number = 0;

  constructor(
    private imageGenService: ImageGenerationService,
    private petService: PetService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const storedId = localStorage.getItem('userId');
    this.userId = storedId ? +storedId : 0;
  }

  loggerB() {
    if (!this.petDescription.trim()) return;

    this.generationLoading = true;
    this.imagePath = "";

    // Generate an image from the pet description
    this.imageGenService.generateImage(this.petDescription).subscribe({
      next: (res) => {
        this.imagePath = res.image_result;
        this.generationLoading = false;
      },
      error: (err) => {
        console.error("Error generating image:", err);
        this.generationLoading = false;
      }
    });
  }

  getSimilarPets() {
    if (!this.imagePath.trim()) return;

    this.petsLoading = true;
    this.showRecommendations = false;

    // Step 1: Get recommended pet IDs and similarity percentages using image URL
    this.imageGenService.recommendSimilarPetsFromImage(this.imagePath).subscribe({
      next: (res) => {
        const matches = res.matches;
        const recommendedIdMap = new Map<number, number>(); // Map<idPet, similarity>

        matches.forEach((match: any) => {
          const petId = +match.properties;
          const similarity = match.similarity_percentage;
          recommendedIdMap.set(petId, similarity);
        });

        // Step 2: Fetch recommended pets by ID
        const petRequests = Array.from(recommendedIdMap.keys()).map(id =>
          this.petService.getPetById(id)
        );

        forkJoin(petRequests).subscribe({
          next: (recommendedPets: Pet[]) => {
            // Step 3: Get all unassigned pets
            this.petService.getUnassignedPets(this.userId).subscribe({
              next: (unassignedPets: Pet[]) => {
                // Step 4: Filter pets that are in both lists
                const unassignedIds = unassignedPets.map(p => p.idPet);
                this.similarPets = recommendedPets
                  .filter(pet => unassignedIds.includes(pet.idPet))
                  .map(pet => ({
                    ...pet,
                    similarity: recommendedIdMap.get(pet.idPet)
                  }));

                this.showRecommendations = true;
                this.petsLoading = false;
              },
              error: (err) => {
                console.error('❌ Error loading unassigned pets:', err);
                this.petsLoading = false;
              }
            });
          },
          error: (err) => {
            console.error('❌ Error loading recommended pets by ID:', err);
            this.petsLoading = false;
          }
        });
      },
      error: (err) => {
        console.error("❌ Error getting recommendations:", err);
        this.petsLoading = false;
      }
    });
  }

  goToDetails(id: number) {
    this.router.navigate(['adoption/pets', id]);
  }

  autoResize(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }
}

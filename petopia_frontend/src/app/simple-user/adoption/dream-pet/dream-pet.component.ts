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
  
    this.similarPets = [];
    this.showRecommendations = false;
  
    this.imageGenService.generateImage(this.petDescription).subscribe({
      next: (res) => {
        console.log("✅ Image generated:", res.image_result);
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

    this.imageGenService.recommendSimilarPetsFromImage(this.petDescription).subscribe({
      next: (res) => {
        const matches = res.matches;
        const recommendedIdMap = new Map<number, number>(); 

        matches.forEach((match: any) => {
          const petId = +match.properties;
          const similarity = match.similarity_percentage;
          recommendedIdMap.set(petId, similarity);
        });

        const petRequests = Array.from(recommendedIdMap.keys()).map(id =>
          this.petService.getPetById(id)
        );

        forkJoin(petRequests).subscribe({
          next: (recommendedPets: Pet[]) => {
            this.petService.getUnassignedPets(this.userId).subscribe({
              next: (unassignedPets: Pet[]) => {
                const unassignedIds = unassignedPets.map(p => p.idPet);
                this.similarPets = recommendedPets
                  .filter(pet => unassignedIds.includes(pet.idPet))
                  .map(pet => ({
                    ...pet,
                    similarity: recommendedIdMap.get(pet.idPet)
                  }));
                  console.log(this.similarPets);
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

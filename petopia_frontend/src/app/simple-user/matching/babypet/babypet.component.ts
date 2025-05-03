import { Component } from '@angular/core';
import { ImageGenerationService } from 'src/app/services/adoptions/imageGeneration/image-generation.service';
import { ActivatedRoute } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { PetService } from 'src/app/services/matchingService/pet.service';
@Component({
  selector: 'app-babypet',
  templateUrl: './babypet.component.html',
  styleUrls: ['./babypet.component.css'],
  animations: [
    trigger('imageReveal', [
      state('void', style({ opacity: 0, transform: 'scale(0.8)' })),
      transition(':enter', [
        animate('500ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ])
  ]
})

export class BabypetComponent {
  petId1: string = '';
  petId2: string = '';
  pet1: any = null; // Store pet1 details (name, image)
  pet2: any = null; // Store pet2 details (name, image)
  babyImageUrl: string = '';
  loading = false;
  error: string | null = null;

  constructor(private babyPetService: ImageGenerationService,
    private route: ActivatedRoute , private petservice:PetService) {}
    ngOnInit() {
      // Retrieve query parameters
      this.route.queryParams.subscribe(params => {
        this.petId1 = params['petId1'] || '';
        this.petId2 = params['petId2'] || '';
        // Optionally, trigger generation automatically if IDs are present
        if (this.petId1 && this.petId2) {
          this.loadPetDetails();
        }
      });
    }
    loadPetDetails() {
      // Fetch pet1 details
      this.petservice.getPetById(+this.petId1).subscribe({
        next: (pet) => {
          this.pet1 = pet;
        },
        error: (err) => {
          console.error('Error fetching pet1:', err);
          this.pet1 = { petName: 'Unknown', petImage: '../../../../assets/images/pet/11416.jpg' };
        }
      });
  
      // Fetch pet2 details
      this.petservice.getPetById(+this.petId2).subscribe({
        next: (pet) => {
          this.pet2 = pet;
        },
        error: (err) => {
          console.error('Error fetching pet2:', err);
          this.pet2 = { petName: 'Unknown', petImage: '../../../../assets/images/pet/11416.jpg' };
        }
      });
    }
  onGenerate() {
    if (!this.petId1 || !this.petId2) {
      this.error = "Both pet IDs are required.";
      return;
    }

    this.loading = true;
    this.error = null;

  this.babyPetService.generateBabyPet(this.petId1, this.petId2).subscribe({
      next: (res) => {
        this.babyImageUrl = res.image_url;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
      }
    });
  }

}

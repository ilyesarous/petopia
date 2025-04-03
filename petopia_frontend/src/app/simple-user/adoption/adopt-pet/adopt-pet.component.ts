import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdoptionService } from 'src/app/services/adoptions/adoption.service';
import { faPaw, faCommentDots, faCamera, faHeart } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-adopt-pet',
  templateUrl: './adopt-pet.component.html',
  styleUrls: ['./adopt-pet.component.css']
})
export class AdoptPetComponent implements OnInit {

  adoptionForm: FormGroup;
  petId!: number;
  selectedFileName: string | null = null;
  faPaw = faPaw;
  faHeart = faHeart;
  faCamera = faCamera;
  faCommentDots = faCommentDots;
  fileError: string = '';
  selectedFile: File | null = null;
  showPopup: boolean = false;  // Controls popup visibility

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private adoptionService: AdoptionService
  ) {
    this.adoptionForm = this.fb.group({
      motivation_letter: ['', [Validators.required, Validators.minLength(20)]]
    });
  }

  ngOnInit(): void {
    // Use the correct parameter name as defined in the route ('idPet')
    this.route.params.subscribe(params => {
      this.petId = +params['idPet']; // Corrected from 'petId' to 'idPet'
      console.log('Retrieved petId:', this.petId);
      if (!this.petId) {
        console.error('Invalid petId');
        return;
      }
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.selectedFileName = file.name;
      this.fileError = '';
    }
  }

  onSubmit(): void {
    console.log('Submit clicked');
    if (this.adoptionForm.invalid) {
      console.log('Form invalid', this.adoptionForm.errors);
      return;
    }
    if (!this.petId) {
      console.log('No petId');
      return;
    }
    if (!this.selectedFile) {
      this.fileError = 'CIN image is required.';
      return;
    }

    console.log('Creating FormData');
    const adoptionPayload = {
      motivation_letter: this.adoptionForm.get('motivation_letter')?.value,
      pet: { idPet: this.petId }
    };

    this.adoptionService.createAdoption(adoptionPayload).subscribe({
      next: (res) => {
        console.log('Success:', res);
        // Instead of alerting, show the popup modal
        this.showPopup = true;
      },
      error: (err) => {
        console.error('Full error:', err);
        console.error('Error status:', err.status);
        console.error('Error message:', err.message);
        alert('There was an error. Please try again.');
      }
    });
  }

  closePopup(): void {
    this.showPopup = false;
    // Navigate after closing the popup if desired
    this.router.navigate(['/home/adoption']);
  }
}

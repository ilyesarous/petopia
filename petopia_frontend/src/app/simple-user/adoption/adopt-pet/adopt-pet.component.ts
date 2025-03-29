import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdoptionService } from 'src/app/services/adoptions/adoption.service';

@Component({
  selector: 'app-adopt-pet',
  templateUrl: './adopt-pet.component.html',
  styleUrls: ['./adopt-pet.component.css']
})
export class AdoptPetComponent {

  adoptionForm: FormGroup;
  petId!: number;
  selectedFile: File | null = null;

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
    this.route.params.subscribe(params => {
      this.petId = +params['petId']; // The '+' converts string to number
      console.log('Retrieved petId:', this.petId); // Debug log
      
      if (!this.petId) {
        console.error('Invalid petId');
        this.router.navigate(['/home/adoption']); // Redirect if no petId
      }
    });  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onSubmit(): void {
    console.log('Submit clicked'); // Check if this appears
  
  if (this.adoptionForm.invalid) {
    console.log('Form invalid', this.adoptionForm.errors);
    return;
  }
  
  if (!this.petId) {
    console.log('No petId');
    return;
  }

  console.log('Creating FormData');
    

    const adoptionData = new FormData();
    adoptionData.append('motivation_letter', this.adoptionForm.get('motivation_letter')?.value);
    // Append the pet id as part of the data (backend expects adoption.pet.idPet)
    adoptionData.append('petId', this.petId.toString());
    if (this.selectedFile) {
      adoptionData.append('cinimage', this.selectedFile, this.selectedFile.name);
    }

    // Call the AdoptionService to submit the adoption form.
    this.adoptionService.createAdoption(adoptionData).subscribe({
      next: (res) => {
        console.log('Success:', res);
        alert('Adoption request submitted successfully!');
        this.router.navigate(['/home/adoption']);
      },
      error: (err) => {
        console.error('Full error:', err);
        console.error('Error status:', err.status);
        console.error('Error message:', err.message);
        alert('There was an error. Please try again.');
      }
    });
  }
}

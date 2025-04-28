import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceAnimalService } from 'src/app/services/Event/service-animal.service';
import { ServiceType } from 'src/app/models/EventModule/serviceAnimal';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ImageGenerationService } from 'src/app/services/adoptions/imageGeneration/image-generation.service';
import { OpenAIService } from 'src/app/services/Event/open-ai.service'; // Add this import

@Component({
  selector: 'app-add-service-animal',
  templateUrl: './add-service-animal.component.html',
  styleUrls: ['./add-service-animal.component.css']
})
export class AddServiceAnimalComponent implements OnInit {
  serviceForm!: FormGroup;
  userId!: number;

  serviceTypes = Object.values(ServiceType);
  serviceId: number | null = null;
  isEditMode = false;

  previewLogo: string | ArrayBuffer | null = null;
  generatedAd: string = ''; // Add this to store the generated ad
  isGeneratingAd: boolean = false; // Loading state

  constructor(
    private fb: FormBuilder,
    private serviceAnimalService: ServiceAnimalService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private imageGenrationService: ImageGenerationService,
    private openAIService: OpenAIService 
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.userId = localStorage.getItem('userId')
      ? parseInt(localStorage.getItem('userId')!)
      : 0;
      console.log('User ID:', this.userId);
    
    // Check if we're editing an existing service
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      const ids=parseInt(id!);
      if (ids) {
        this.serviceId = +ids;
        this.isEditMode = true;
        this.loadServiceForUpdate(this.serviceId);
      }
    });
  }

  initializeForm(): void {
    this.serviceForm = this.fb.group({
      descriptionServiceAnimal: ['', Validators.required],
      typeService: [ServiceType, Validators.required],
      prixServiceAnimal: [0, [Validators.required, Validators.min(0)]],
      location: ['', Validators.required],
      animalType: ['', Validators.required],
      specialRequirements: [''],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      logoFile: [null] 
  });
}
// Add this method to your component class
removeLogo(): void {
  this.previewLogo = null;
  this.serviceForm.patchValue({ logo: null });
  // If you're using a separate property for the file object, reset that too
  // this.selectedLogoFile = null;
}

  loadServiceForUpdate(serviceId: number): void {
    this.serviceAnimalService.getServiceAnimalById(serviceId).subscribe(
      (serviceData) => {
        this.serviceForm.patchValue({
          descriptionServiceAnimal: serviceData.descriptionServiceAnimal,
          typeService: serviceData.typeService,
          organisateurServiceAnimal: serviceData.organisateurServiceAnimal ? 
          { id_user: serviceData.organisateurServiceAnimal.id_user } 
          : null
        });
        if (serviceData.imagePath) {
          this.previewLogo = serviceData.imagePath;
        }
      },
      (error) => {
        console.error('Error loading service:', error);
        alert('Error loading service details.');
      }
    );
  }

  onSubmit(): void {
    if (this.serviceForm.valid) {
      const formData = this.serviceForm.value;
    const { logoFile, ...serviceData } = formData;
    
    console.log('Submitting:', serviceData);
    
    this.serviceAnimalService.createServiceAnimal(serviceData, logoFile).subscribe({
      next: () => {
        alert('Service created successfully!');
        this.router.navigate(['/services']);
      },
      error: (err) => {
        console.error('Full error:', err);
        if (err.error) {
          alert(`Error: ${err.error.message || err.error}`);
        } else {
          alert('Error creating service. See console for details.');
        }
      }
    });
  } else {
    this.markFormGroupTouched(this.serviceForm);
  }
  }

  

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (!file) return;
  
    if (!file.type.match(/image\/(jpeg|png|gif|jpg)/)) {
      alert('Only JPEG, PNG, or GIF images are allowed');
      return;
    }
  
    this.serviceForm.patchValue({ logoFile: file });
  
    const reader = new FileReader();
    reader.onload = () => {
      this.previewLogo = reader.result;
  
      const base64 = (reader.result as string).split(',')[1];
  
      this.imageGenrationService.detectBreedFromImage(base64).subscribe({
        next: (res: any) => {
          console.log("🧠 AI Raw Response:", res);
  
          const analysis = res.analysis || res.result;
  
          if (typeof analysis !== 'string') {
            console.error("❌ Unexpected response format:", analysis);
            return;
          }
  
          // Match species from GPT string
          const speciesMatch = analysis.match(/Species:\s*(Dog|Cat)/i);
          const species = speciesMatch?.[1]?.toUpperCase();
  
          if (species === 'DOG' || species === 'CAT') {
            this.serviceForm.patchValue({ animalType: species });
            console.log("✅ Auto-filled species:", species);
          } else {
            console.warn("⚠️ Species not found in AI response.");
          }
        },
        error: (err) => {
          console.error("❌ Error from detection service:", err);
        }
      });
    };
  
    reader.readAsDataURL(file);
  }

  // Helper method to mark all form controls as touched
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Method to go back
  goBack(): void {
    this.location.back();
  }

  generateAd(): void {
    const description = this.serviceForm.get('descriptionServiceAnimal')?.value;
    
    if (!description) {
      alert('Please enter a service description first');
      return;
    }
  
    this.isGeneratingAd = true;
    this.generatedAd = '';
  
    this.openAIService.generatePetAd(description).subscribe({
      next: (adText) => {
        this.generatedAd = adText;
        this.isGeneratingAd = false;
      },
      error: (err) => {
        console.error('Error generating ad:', err);
        this.isGeneratingAd = false;
        alert('Error generating advertisement. Please try again.');
      }
    });
  }
  copyAdToClipboard(): void {
    navigator.clipboard.writeText(this.generatedAd)
      .then(() => alert('Ad copied to clipboard!'))
      .catch(err => console.error('Failed to copy:', err));
  }
  
  useGeneratedAd(): void {
    if (this.generatedAd) {
      this.serviceForm.patchValue({
        descriptionServiceAnimal: this.generatedAd
      });
    }
  }
  
}
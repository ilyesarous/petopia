import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceAnimalService } from 'src/app/services/Event/service-animal.service';
import { ServiceType } from 'src/app/models/EventModule/serviceAnimal';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

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


  constructor(
    private fb: FormBuilder,
    private serviceAnimalService: ServiceAnimalService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
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
    if (file) {
      if (!file.type.match(/image\/(jpeg|png|gif|jpg)/)) {
        alert('Only JPEG, PNG, or GIF images are allowed');
        return;
      }
      


      this.serviceForm.patchValue({
        logoFile: file 
      });

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.previewLogo = reader.result;
      };
      reader.readAsDataURL(file);
    }
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
}
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
  serviceTypes = Object.values(ServiceType);
  serviceId: number | null = null;
  isEditMode = false;

  

  constructor(
    private fb: FormBuilder,
    private serviceAnimalService: ServiceAnimalService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    
    // Check if we're editing an existing service
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.serviceId = +id;
        this.isEditMode = true;
        this.loadServiceForUpdate(this.serviceId);
      }
    });
  }

  initializeForm(): void {
    this.serviceForm = this.fb.group({
      prixServiceAnimal: [0, [
        Validators.required, 
        Validators.min(0)
      ]],
      descriptionServiceAnimal: ['', Validators.required],
      disponibilite: [true, Validators.required],
      typeService: [ServiceType.DOG_WALKING, Validators.required]
    });
  }

  loadServiceForUpdate(serviceId: number): void {
    this.serviceAnimalService.getServiceAnimalById(serviceId).subscribe(
      (serviceData) => {
        this.serviceForm.patchValue({
          prixServiceAnimal: serviceData.prixServiceAnimal,
          descriptionServiceAnimal: serviceData.descriptionServiceAnimal,
          disponibilite: serviceData.disponibilite,
          typeService: serviceData.typeService
        });
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

      if (this.isEditMode && this.serviceId) {
        // Update existing service
        this.serviceAnimalService.updateServiceAnimal(this.serviceId, formData).subscribe(
          () => {
            alert('Service updated successfully!');
            this.router.navigate(['/services']);
          },
          (error) => {
            console.error('Error updating service:', error);
            alert('Error updating service.');
          }
        );
      } else {
        // Create new service
        this.serviceAnimalService.createServiceAnimal(formData).subscribe(
          () => {
            alert('Service created successfully!');
            this.router.navigate(['/services']);
          },
          (error) => {
            console.error('Error creating service:', error);
            alert('Error creating service.');
          }
        );
      }
    } else {
      this.markFormGroupTouched(this.serviceForm);
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
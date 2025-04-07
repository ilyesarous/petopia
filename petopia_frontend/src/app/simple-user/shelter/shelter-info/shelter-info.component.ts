import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Shelter } from 'src/app/models/adoption/shelter/Shelter';
import { ShelterService } from 'src/app/services/adoptions/shelter/shelter.service';
import { faPen } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-shelter-info',
  templateUrl: './shelter-info.component.html',
  styleUrls: ['./shelter-info.component.css']
})
export class ShelterInfoComponent {
  shelterForm!: FormGroup;
  shelterData!: Shelter;
  isEditing: boolean = false;
  alertMessage: string = '';
  alertType: string = 'success'; // 'success' or 'danger'
  faPen = faPen;
  logoFile: File | null = null;  // To hold the selected logo file
  logoPreviewUrl: string | null = null;  // To hold the preview URL for the selected logo

  constructor(
    private fb: FormBuilder,
    private shelterService: ShelterService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    this.loadShelter(userId ? parseInt(userId) : 0);
  }

  loadShelter(userId: number): void {
    this.shelterService.getShelterByUserId(userId).subscribe({
      next: (data) => {
        this.shelterData = data;
        this.initForm();
      },
      error: (err) => {
        console.error('Error loading shelter info', err);
      }
    });
  }

  initForm(): void {
    this.shelterForm = this.fb.group({
      shelter_name: [this.shelterData.shelter_name, Validators.required],
      location: [this.shelterData.location, Validators.required],
      email: [this.shelterData.email, [Validators.required, Validators.email]],
      phone_number: [this.shelterData.phone_number, Validators.required],
      description: [this.shelterData.description, Validators.required],
      website: [this.shelterData.website]
    });
  }

  enableEdit(): void {
    this.isEditing = true;
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.shelterForm.patchValue({
      shelter_name: this.shelterData.shelter_name,
      location: this.shelterData.location,
      email: this.shelterData.email,
      phone_number: this.shelterData.phone_number,
      description: this.shelterData.description,
      website: this.shelterData.website
    });
  }

  // Handle logo file change and generate a preview URL for the image
  onLogoChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.logoFile = file;  // Store the actual file
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.logoPreviewUrl = e.target.result;  // Set the preview URL for the logo image
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.shelterForm.invalid) {
      return;
    }

    const updatedShelter: Shelter = {
      ...this.shelterData,
      ...this.shelterForm.value
    };

    // Pass the logo file to the update method (either the file or null)
    this.shelterService.updateShelter(updatedShelter, this.logoFile).subscribe({
      next: (res) => {
        this.shelterData = res;
        this.isEditing = false;
        this.alertType = 'success';
        this.alertMessage = 'Shelter information updated successfully!';
        setTimeout(() => (this.alertMessage = ''), 3000);
      },
      error: (err) => {
        console.error('Error updating shelter info', err);
        this.alertType = 'danger';
        this.alertMessage = 'Error updating shelter info. Please try again.';
        setTimeout(() => (this.alertMessage = ''), 3000);
      }
    });
  }
}

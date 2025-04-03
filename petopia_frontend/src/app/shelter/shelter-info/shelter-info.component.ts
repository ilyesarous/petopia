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
  faPen=faPen;

  constructor(
    private fb: FormBuilder,
    private shelterService: ShelterService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // TODO: Replace with userId from local storage or auth service
    this.loadShelter(4);
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

  onSubmit(): void {
    if (this.shelterForm.invalid) {
      return;
    }
    const updatedShelter: Shelter = {
      ...this.shelterData,
      ...this.shelterForm.value
    };

    this.shelterService.updateShelter(updatedShelter).subscribe({
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

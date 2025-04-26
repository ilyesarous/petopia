import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BrandsService } from 'src/app/services/store/brands/brands.service';

@Component({
  selector: 'app-add-brands',
  templateUrl: './add-brands.component.html',
  styleUrls: ['./add-brands.component.css'],
})
export class AddBrandsComponent {
  @Output() close = new EventEmitter<void>();
  @Output() brandAdded = new EventEmitter<any>();

  brandForm: FormGroup;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  isLoading = false;
  isFileSelected = false; // New flag for file selection

  constructor(private fb: FormBuilder, private brandService: BrandsService) {
    this.brandForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      // Remove image from form group since file inputs work differently
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.isFileSelected = true; // Set flag when file is selected

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(file);
    } else {
      this.isFileSelected = false;
    }
  }

  onSubmit(): void {
    // Check both form validity AND file selection
    if (this.brandForm.valid && this.isFileSelected && this.selectedFile) {
      this.isLoading = true;

      // Simulate API call
      const formData = new FormData();
      formData.append('name', this.brandForm.value.name);
      formData.append('image', this.selectedFile);

      this.brandService.addBrand(formData).subscribe({
        next: (response) => {
          this.brandAdded.emit(response);
          this.closePopup();
        },
        error: (err) => {
          console.error('Error creating brand:', err);
          this.isLoading = false;
        },
      });
    }
  }

  closePopup(): void {
    this.close.emit();
  }

  // Helper method to check if form is ready for submission
  isFormValid(): boolean {
    return this.brandForm.valid && this.isFileSelected;
  }
}

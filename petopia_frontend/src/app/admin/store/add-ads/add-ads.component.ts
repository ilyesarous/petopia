import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdsService } from 'src/app/services/store/ads/ads.service';

@Component({
  selector: 'app-add-ads',
  templateUrl: './add-ads.component.html',
  styleUrls: ['./add-ads.component.css']
})
export class AddAdsComponent {
  @Output() close = new EventEmitter<void>();
  @Output() adAdded = new EventEmitter<any>();
  
  adForm: FormGroup;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private adsService: AdsService
  ) {
    this.adForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', Validators.maxLength(500)],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      status: ['ACTIVE']
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.adForm.valid && this.selectedFile) {
      this.isLoading = true;
      
      const formData = new FormData();
      formData.append('title', this.adForm.value.title);
      formData.append('description', this.adForm.value.description);
      formData.append('startDate', this.adForm.value.startDate);
      formData.append('endDate', this.adForm.value.endDate);
      formData.append('status', this.adForm.value.status);
      formData.append('imageUrl', this.selectedFile);
      console.log(formData.get('title'));
      this.adsService.addAds(formData).subscribe({
        next: (response) => {
          this.adAdded.emit(response);
          this.closePopup();
        },
        error: (err) => {
          console.error('Error creating ad:', err);
          this.isLoading = false;
        }
      });
    }
  }

  closePopup(): void {
    this.close.emit();
  }
}

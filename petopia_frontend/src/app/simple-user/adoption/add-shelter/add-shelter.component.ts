import { Component, ElementRef, ViewChild  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ShelterService } from 'src/app/services/adoptions/shelter/shelter.service';

@Component({
  selector: 'app-add-shelter',
  templateUrl: './add-shelter.component.html',
  styleUrls: ['./add-shelter.component.css']
})
export class AddShelterComponent {
  shelterForm: FormGroup;
  logoFile: File | null = null;
  logoPreview: string | null = null;
  successMessage = '';
  errorMessage = '';
  logoTouched = false;

  constructor(
    private fb: FormBuilder,
    private shelterService: ShelterService,
    private router: Router
  ) {
    this.shelterForm = this.fb.group({
      shelter_name: ['', Validators.required],
      location: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      website: ['', [Validators.pattern('https?://.+')]]
    });
  }

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.logoFile = target.files[0];
      this.logoTouched = true;

      // Show preview
      const reader = new FileReader();
      reader.onload = () => {
        this.logoPreview = reader.result as string;
      };
      reader.readAsDataURL(this.logoFile);
    }
  }

  isFieldInvalid(field: string): boolean {
    const control = this.shelterForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  isLogoInvalid(): boolean {
    return !this.logoFile && this.logoTouched;
  }

  onSubmit() {
    this.logoTouched = true;

    if (this.shelterForm.valid && this.logoFile) {
      const shelterData = this.shelterForm.value;
      this.shelterService.createShelter(shelterData, this.logoFile).subscribe({
        next: () => {
          this.successMessage = 'Shelter created successfully!';
          this.errorMessage = '';
          this.router.navigate(['/shelter/home']);
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Something went wrong!';
          this.successMessage = '';
        }
      });
    } else if (!this.logoFile) {
      this.errorMessage = 'Logo is required.';
    }
  }
  @ViewChild('logoInput') logoInputRef!: ElementRef<HTMLInputElement>;
  triggerLogoInput() {
    this.logoInputRef.nativeElement.click();
  }
  
}

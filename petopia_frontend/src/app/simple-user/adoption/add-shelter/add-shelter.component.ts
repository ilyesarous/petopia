import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import { ShelterService } from 'src/app/services/adoptions/shelter/shelter.service';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'assets/leaflet/marker-icon-2x.png',
  iconUrl: 'assets/leaflet/marker-icon.png',
  shadowUrl: 'assets/leaflet/marker-shadow.png',
});

@Component({
  selector: 'app-add-shelter',
  templateUrl: './add-shelter.component.html',
  styleUrls: ['./add-shelter.component.css']
})
export class AddShelterComponent implements AfterViewInit {
  shelterForm: FormGroup;
  logoFile: File | null = null;
  logoPreview: string | null = null;
  successMessage = '';
  errorMessage = '';
  logoTouched = false;
  map: any;
  marker: any;
  latitude?: number;
  longitude?: number;

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

  ngAfterViewInit(): void {
    this.initMap();
  }

  initMap(): void {
    this.map = L.map('shelter-map').setView([36.8065, 10.1815], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      this.latitude = lat;
      this.longitude = lng;

      this.updateAddressFromCoords(lat, lng);
      this.setMarker(lat, lng);
    });
  }

  setMarker(lat: number, lng: number): void {
    if (this.marker) this.map.removeLayer(this.marker);
    this.marker = L.marker([lat, lng]).addTo(this.map).bindPopup('Selected Location').openPopup();
    this.map.setView([lat, lng], 15);
  }

  updateAddressFromCoords(lat: number, lng: number): void {
    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
      .then(res => res.json())
      .then(data => {
        const address = data.display_name || 'Unknown address';
        this.shelterForm.get('location')?.setValue(address);
      })
      .catch(err => {
        console.error('Reverse geocoding failed:', err);
        this.shelterForm.get('location')?.setValue('Unknown address');
      });
  }

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.logoFile = target.files[0];
      this.logoTouched = true;
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
    if (this.shelterForm.valid && this.logoFile && this.latitude && this.longitude) {
      const shelterData = {
        ...this.shelterForm.value,
        latitude: this.latitude,
        longitude: this.longitude
      };

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
    } else if (!this.latitude || !this.longitude) {
      this.errorMessage = 'Please select a location on the map.';
    }
  }

  @ViewChild('logoInput') logoInputRef!: ElementRef<HTMLInputElement>;
  triggerLogoInput() {
    this.logoInputRef.nativeElement.click();
  }
}

import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Shelter } from 'src/app/models/adoption/shelter/Shelter';
import { ShelterService } from 'src/app/services/adoptions/shelter/shelter.service';
import * as L from 'leaflet';
import { faPen } from '@fortawesome/free-solid-svg-icons';
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'assets/leaflet/marker-icon-2x.png',
  iconUrl: 'assets/leaflet/marker-icon.png',
  shadowUrl: 'assets/leaflet/marker-shadow.png',
});
@Component({
  selector: 'app-shelter-info',
  templateUrl: './shelter-info.component.html',
  styleUrls: ['./shelter-info.component.css']
})
export class ShelterInfoComponent implements OnInit, AfterViewInit {
  shelterForm!: FormGroup;
  shelterData!: Shelter;
  isEditing = false;
  alertMessage = '';
  alertType = 'success';
  faPen = faPen;
  logoFile: File | null = null;
  logoPreviewUrl: string | null = null;
  map: any;
  marker: any;
  selectedAddress: string = '';

  constructor(private fb: FormBuilder, private shelterService: ShelterService) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    if (userId) this.loadShelter(+userId);
  }

  ngAfterViewInit(): void {
  }
  loadShelter(userId: number): void {
    this.shelterService.getShelterByUserId(userId).subscribe({
      next: (data) => {
        this.shelterData = data;
        this.initForm();
  
    
      },
      error: (err) => console.error('Error loading shelter info', err)
    });
  }
  

  initForm(): void {
    this.shelterForm = this.fb.group({
      shelter_name: [this.shelterData.shelter_name, Validators.required],
      location: [this.shelterData.location, Validators.required],
      email: [this.shelterData.email, [Validators.required, Validators.email]],
      phone_number: [this.shelterData.phone_number, [Validators.required, Validators.pattern(/^\d{8}$/)]],
      description: [this.shelterData.description, [Validators.required, Validators.minLength(10)]],
      website: [this.shelterData.website, [Validators.pattern('https?://.+')]]
    });
  }
  enableEdit(): void {
    this.isEditing = true;
  
    setTimeout(() => {
      const container = document.getElementById('shelter-map');
      if (container && !this.map) {
        this.initMap(); // map will center on Tunisia or saved location
        if (this.shelterData.latitude && this.shelterData.longitude) {
          this.addMarker(this.shelterData.latitude, this.shelterData.longitude);
        }
      }
    }, 100);
  }
  

  cancelEdit(): void {
    this.isEditing = false;
    this.initForm();
    if (this.map) {
      this.map.off(); // remove all event listeners
      this.map.remove(); // destroy map instance
      this.map = null;
      this.marker = null;
    }
  }

  onLogoChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.logoFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.logoPreviewUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.shelterForm.invalid) return;

    const updatedShelter: Shelter = {
      ...this.shelterData,
      ...this.shelterForm.value,
      latitude: this.shelterData.latitude,
      longitude: this.shelterData.longitude
    };

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

 initMap(): void {
    if (this.map) return;
  
    // Default center on Tunisia if no shelter coordinates
    const defaultLat = 36.8065; // Tunis
    const defaultLng = 10.1815;
  
    const initialLat = this.shelterData.latitude || defaultLat;
    const initialLng = this.shelterData.longitude || defaultLng;
  
    this.map = L.map('shelter-map').setView([initialLat, initialLng], 13);
  
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);
  
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      this.shelterData.latitude = lat;
      this.shelterData.longitude = lng;
  
      this.getAddressFromCoords(lat, lng);
      this.addMarker(lat, lng);
    });
  }
  

  private addMarker(lat: number, lng: number): void {
    if (!this.map) return;
  
    if (this.marker) this.map.removeLayer(this.marker);
  
    this.marker = L.marker([lat, lng])
      .addTo(this.map)
      .bindPopup('Selected Location')
      .openPopup();
  
    this.map.setView([lat, lng], 15); // ✅ Ensure center and zoom
  }
  

  private getAddressFromCoords(lat: number, lng: number): void {
    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
      .then(res => res.json())
      .then(data => {
        const address = data.display_name || 'Unknown address';
        this.selectedAddress = address;
        this.shelterForm.get('location')?.setValue(address); 
      })
      .catch(err => {
        console.error('Error fetching address:', err);
        this.selectedAddress = 'Unknown address';
      });
  }
  
}

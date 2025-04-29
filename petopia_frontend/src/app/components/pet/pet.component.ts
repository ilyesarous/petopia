import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as L from 'leaflet';
import axios from 'axios';
import {AuthService} from "../../services/user/auth.service";
import {PetService} from "../../services/user/pet.service";
import { ImageGenerationService } from 'src/app/services/adoptions/imageGeneration/image-generation.service';
enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE'
}

enum Size {
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE'
}

enum PetStatus {
  AVAILABLE = 'AVAILABLE',
  ADOPTED = 'ADOPTED',
  PENDING = 'PENDING'
}
@Component({
  selector: 'app-pet',
  templateUrl: './pet.component.html',
  styleUrls: ['./pet.component.css']
})
export class PetComponent implements AfterViewInit {
  @ViewChild('fileInput') fileInput!: ElementRef;

  map!: L.Map;
  marker!: L.Marker;
  petForm: FormGroup;
  showSuccess = false;
  submitted = false;
  searchQuery: string = '';
  selectedImage: File | null = null;
  genderOptions = Object.values(Gender);
  sizeOptions = Object.values(Size);
  statusOptions = Object.values(PetStatus);

  constructor(
    private fb: FormBuilder,
    private petService: PetService,
    private authService: AuthService,
    private imageGenerationService: ImageGenerationService

  ) {
    this.petForm = this.fb.group({
      petName: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z\s]{2,20}$/),
        Validators.minLength(2),
        Validators.maxLength(20)
      ]],
      petAge: ['', [
        Validators.required,
        Validators.min(1),
        Validators.max(14)
      ]],
      petImage: ['', Validators.required],
      location: ['', Validators.required],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
      selectedGender: [Gender.MALE, Validators.required],
      selectedSize: [Size.SMALL, Validators.required],
      selectedStatus: [PetStatus.AVAILABLE, Validators.required]
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      this.petForm.get('petImage')?.setErrors({ invalidType: true });
      return;
    }

    const maxSize = 4 * 1024 * 1024; // 4MB
    if (file.size > maxSize) {
      this.petForm.get('petImage')?.setErrors({ invalidSize: true });
      return;
    }

    this.selectedImage = file;
    this.petForm.patchValue({ petImage: file });  // Set the file object as value
    this.petForm.get('petImage')?.updateValueAndValidity();  // Update validation status
  }

  onSubmit(): void {
    this.submitted = true;
    const userId = localStorage.getItem('userId');
    if (!userId) {
      this.petForm.setErrors({ unauthenticated: true });
      return;
    }

    if (this.petForm.valid) {

      const fileInput = this.fileInput.nativeElement;
      if (fileInput.files.length === 0) {
        this.petForm.get('petImage')?.setErrors({ required: true });
        return;
      }

      const imageFile = this.petForm.get('petImage')?.value;

      const petData = {
        petName: this.petForm.value.petName,
        petAge: this.petForm.value.petAge,
        location: this.petForm.value.location,
        attitudeX: this.petForm.value.latitude,
        attitudeY: this.petForm.value.longitude,
        gender: this.petForm.value.selectedGender,
        size: this.petForm.value.selectedSize,
        status: this.petForm.value.selectedStatus,
        user: { id_user: userId }
      };

      this.petService.addPet(petData, imageFile).subscribe(
        (response: any) => {
          this.showSuccess = true;
          this.petForm.reset({
            selectedGender: Gender.MALE,
            selectedSize: Size.SMALL,
            selectedStatus: PetStatus.AVAILABLE
          });
          this.fileInput.nativeElement.value = '';
          this.submitted = false;

          // Show species and breed in success message
          console.log('Pet added:', response.pet);
          const newPetId = String(response.pet.idPet);
          const newPetImage = String(response.pet.petImage);
          
          if (newPetImage && newPetId) {
            this.imageGenerationService
              .storeImageDescription(newPetImage, newPetId)
              .subscribe({
                next: (res) => console.log("📝 Description stored:", res),
                error: (err) => console.error("❌ Failed to store description:", err)
              });
          } else {
            console.warn('⚠️ Missing image or pet ID.');
          }
          
          setTimeout(() => this.showSuccess = false, 3000);
        },
        (error) => {
          this.petForm.setErrors({ apiError: true });
          console.error('Error adding pet:', error);
        }
      );
    }
  }
  ngAfterViewInit(): void {
    this.initializeMap();
  }

  initializeMap(): void {
    this.map = L.map('map').setView([51.505, -0.09], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.map.on('click', async (event: L.LeafletMouseEvent) => {
      const latitude = event.latlng.lat;
      const longitude = event.latlng.lng;

      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );
        const address = response.data.address;
        const location = address.road || address.village || address.town || address.city || address.country;

        this.petForm.patchValue({ latitude, longitude, location });
        console.log(location);
        if (this.marker) {
          this.map.removeLayer(this.marker);
        }

        this.marker = L.marker([latitude, longitude], {
          icon: L.icon({
            iconUrl: 'assets/images/marker.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34]
          })
        }).addTo(this.map);

      } catch (error) {
        console.error('Error fetching location name:', error);
        this.petForm.patchValue({ location: 'Unknown Location' });
      }
    });
  }

  async searchLocation() {
    if (!this.searchQuery) return;

    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(this.searchQuery)}`
      );

      if (response.data.length > 0) {
        const result = response.data[0];
        const latitude = parseFloat(result.lat);
        const longitude = parseFloat(result.lon);
        const locationName = result.display_name;

        this.map.setView([latitude, longitude], 15);

        if (this.marker) {
          this.map.removeLayer(this.marker);
        }

        this.marker = L.marker([latitude, longitude], {
          icon: L.icon({
            iconUrl: 'assets/marker.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34]
          })
        }).addTo(this.map).bindPopup(locationName).openPopup();

        this.petForm.patchValue({
          latitude,
          longitude,
          location: locationName
        });
      } else {
        alert('Location not found.');
      }
    } catch (error) {
      console.error('Error during location search:', error);
    }
  }

  isFieldInvalid(field: string): boolean {
    const formField = this.petForm.get(field);
    return <boolean>formField?.invalid && (formField?.touched || formField?.dirty || this.submitted);
  }
}

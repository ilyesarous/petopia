import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { StripePaymentService } from 'src/app/services/vet/payment/stripe-payment.service';
import { ActivatedRoute } from '@angular/router';
import { PetService } from 'src/app/services/pets/pet.service';
import { Pet } from 'src/app/models/pet/Pet';
import { MatDialog } from '@angular/material/dialog';
import { VetSelectionPopupComponent } from '../vet-selection-popup/vet-selection-popup.component';
import { VetLocationService } from 'src/app/services/vet/location/vet-location.service'; 

@Component({
  selector: 'app-dash-principale-user',
  templateUrl: './dash-principale-user.component.html',
  styleUrls: ['./dash-principale-user.component.css'],
})
export class DashPrincipaleUserComponent implements OnInit, AfterViewInit {
  userPets: Pet[] = [];
  loading = true;
  private map: any;
  private marker: any;
  selectedLocation: string = '';
  vetLocations: any[] = [];

  constructor(
    private stripePaymentService: StripePaymentService,
    private route: ActivatedRoute,
    private petService: PetService,
    private dialog: MatDialog,
    private vetLocationService: VetLocationService
  ) {}

  ngOnInit() {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.loadUserPets(parseInt(userId));
    }

    this.route.queryParams.subscribe(params => {
      if (params['payment_status'] === 'success') {
        setTimeout(() => {
          this.stripePaymentService.showPaymentStatus('success');
        }, 500);
      } else if (params['payment_status'] === 'cancel') {
        setTimeout(() => {
          this.stripePaymentService.showPaymentStatus('cancel');
        }, 500);
      }
    });
  }

  openVetSelectionDialog(): void {
    this.dialog.open(VetSelectionPopupComponent, {
      width: '500px',
      disableClose: true
    });
  }
  
  loadUserPets(userId: number) {
    this.petService.getPetsByOwnerId(userId).subscribe({
      next: (pets) => {
        this.userPets = pets;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading pets:', err);
        this.loading = false;
      }
    });
  }
/*
  handlePaymentClick() {
    this.stripePaymentService.redirectToCheckout();
  }
*/
  redirectToUrlDogBreedRecognition() {
    window.location.href = 'http://localhost:8501';
  }

  ngAfterViewInit(): void {
      this.initMap();
      this.loadVetLocations();
    }

    private loadVetLocations(): void {
      this.vetLocationService.getAllLocations().subscribe(locations => {
        this.vetLocations = locations;
        this.addLocationsToMap(); 
      });
    }
  
    private addLocationsToMap(): void {
      this.vetLocations.forEach(location => {
        const marker = L.marker([location.latitude, location.longitude])
          .addTo(this.map)
          .bindPopup(`
            <div class="custom-popup">
              <h3 style="color: #F83182; margin-bottom: 10px;">${location.vet.name}</h3>
              <div class="popup-details">
                <p><i class="fas fa-envelope" style="color: #FF617C;"></i> ${location.vet.email}</p>
                <p><i class="fas fa-phone" style="color: #FF617C;"></i> ${location.vet.phoneNumber}</p>
                <p><i class="fas fa-map-marker-alt" style="color: #FF617C;"></i> ${location.address}</p>
              </div>
            </div>
          `);
      });
    }

    private initMap(): void {
      // Initialisation de la carte
      this.map = L.map('map').setView([36.8065, 10.1815], 13); // Coordonnées centrées sur Tunis
  
      // Ajout des tuiles OpenStreetMap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);
  
      // Gestion du clic sur la carte
      this.map.on('click', (e: L.LeafletMouseEvent) => {
        this.onMapClick(e);
      });
    }
  
    private onMapClick(e: L.LeafletMouseEvent): void {
      // Supprime le marqueur existant
      if (this.marker) {
        this.map.removeLayer(this.marker);
      }
  
      // Ajoute un nouveau marqueur
      this.marker = L.marker(e.latlng).addTo(this.map);
  
      // Récupère les informations de localisation
      fetch(`https://nominatim.openstreetmap.org/reverse?lat=${e.latlng.lat}&lon=${e.latlng.lng}&format=json`)
        .then(response => response.json())
        .then(data => {
          const country = data.address.country || '';
          const city = data.address.city || data.address.town || data.address.village || '';
          this.selectedLocation = city ? `${city}, ${country}` : country;
        })
        .catch(error => console.error('Error:', error));
    }
  
    locateMe(): void {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLocation = L.latLng(position.coords.latitude, position.coords.longitude);
            
            // Centre la carte sur la position de l'utilisateur
            this.map.setView(userLocation, 15);
            
            // Supprime l'ancien marqueur s'il existe
            if (this.marker) {
              this.map.removeLayer(this.marker);
            }
            
            // Ajoute un nouveau marqueur
            this.marker = L.marker(userLocation)
              .addTo(this.map)
              .bindPopup("You are here!")
              .openPopup();
            
            // Trouve et affiche le vétérinaire le plus proche
            /*
            const nearestVet = this.findNearestVet(
              position.coords.latitude, 
              position.coords.longitude
            );
            
            if (nearestVet) {
              const popupContent = `
                <div class="nearest-vet-popup">
                  <h4>Nearest Veterinarian</h4>
                  <p><strong>${nearestVet.vet.vet.name}</strong></p>
                  <p>${nearestVet.vet.address}</p>
                  <p>Distance: ${nearestVet.distance.toFixed(2)} km</p>
                </div>
              `;
              
              L.popup()
                .setLatLng([nearestVet.vet.latitude, nearestVet.vet.longitude])
                .setContent(popupContent)
                .openOn(this.map);
            }
    */
            // Met à jour les informations de localisation
            fetch(`https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`)
              .then(response => response.json())
              .then(data => {
                const country = data.address.country || '';
                const city = data.address.city || data.address.town || data.address.village || '';
                this.selectedLocation = city ? `${city}, ${country}` : country;
              })
              .catch(error => console.error('Error:', error));
          },
          (error) => {
            console.error('Error getting location:', error);
            alert('Could not get your location. Please make sure location services are enabled.');
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          }
        );
      } else {
        alert('Geolocation is not supported by this browser.');
      }
    }

    private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
      const R = 6371; // Rayon de la Terre en km
      const dLat = this.deg2rad(lat2 - lat1);
      const dLon = this.deg2rad(lon2 - lon1);
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      return R * c; // Distance en km
    }
    
    private deg2rad(deg: number): number {
      return deg * (Math.PI/180);
    }

    findNearestVet(userLat: number, userLng: number): any {
      if (this.vetLocations.length === 0) return null;
    
      let nearestVet = this.vetLocations[0];
      let shortestDistance = this.calculateDistance(
        userLat, userLng, 
        nearestVet.latitude, nearestVet.longitude
      );
    
      this.vetLocations.forEach(location => {
        const distance = this.calculateDistance(
          userLat, userLng, 
          location.latitude, location.longitude
        );
        if (distance < shortestDistance) {
          shortestDistance = distance;
          nearestVet = location;
        }
      });
    
      return {
        vet: nearestVet,
        distance: shortestDistance
      };
    }

    findNearestVetToMyLocation(): void {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const nearestVet = this.findNearestVet(
              position.coords.latitude, 
              position.coords.longitude
            );
            
            if (nearestVet) {
              this.map.setView(
                [nearestVet.vet.latitude, nearestVet.vet.longitude], 
                15
              );
              
              const popupContent = `
                <div class="nearest-vet-popup">
                  <h4 style="color: #F83182; border-bottom: 2px solid #FF617C; padding-bottom: 5px; margin-bottom: 10px;">
                    <i class="fas fa-star" style="color: #FE9A7A;"></i> Nearest Veterinarian
                  </h4>
                  <p style="margin: 8px 0;">
                    <i class="fas fa-user-md" style="color: #FF617C;"></i> 
                    <strong style="color: #F83182;">${nearestVet.vet.vet.name}</strong>
                  </p>
                  <p style="margin: 8px 0;">
                    <i class="fas fa-map-marker-alt" style="color: #FF617C;"></i> 
                    <span style="color: #333;">${nearestVet.vet.address}</span>
                  </p>
                  <p style="margin: 8px 0; background: #FFF5F7; padding: 5px; border-radius: 4px;">
                    <i class="fas fa-route" style="color: #FE9A7A;"></i> 
                    Distance: <strong style="color: #F83182;">${nearestVet.distance.toFixed(2)} km</strong>
                  </p>
                </div>
              `;
              
              L.popup()
                .setLatLng([nearestVet.vet.latitude, nearestVet.vet.longitude])
                .setContent(popupContent)
                .openOn(this.map);
            }
          },
          (error) => {
            console.error('Error getting location:', error);
            alert('Could not get your location. Please make sure location services are enabled.');
          }
        );
      } else {
        alert('Geolocation is not supported by this browser.');
      }
    }

}
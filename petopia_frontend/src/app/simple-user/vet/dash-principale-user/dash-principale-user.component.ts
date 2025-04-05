import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { StripePaymentService } from 'src/app/services/vet/payment/stripe-payment.service';
import { ActivatedRoute } from '@angular/router';
import { PetService } from 'src/app/services/pets/pet.service';
import { Pet } from 'src/app/models/pet/Pet';
import { MatDialog } from '@angular/material/dialog';
import { VetSelectionPopupComponent } from '../vet-selection-popup/vet-selection-popup.component';


@Component({
  selector: 'app-dash-principale-user',
  templateUrl: './dash-principale-user.component.html',
  styleUrls: ['./dash-principale-user.component.css']
})
export class DashPrincipaleUserComponent implements OnInit, AfterViewInit {
  userPets: Pet[] = [];
  loading = true;
  private map: any;
  private marker: any;
  selectedLocation: string = '';

  constructor(
    private stripePaymentService: StripePaymentService,
    private route: ActivatedRoute,
    private petService: PetService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    // Récupérer l'ID de l'utilisateur connecté
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
            enableHighAccuracy: true, // Pour une meilleure précision
            timeout: 10000, // 10 secondes de timeout
            maximumAge: 0 // Ne pas utiliser de position en cache
          }
        );
      } else {
        alert('Geolocation is not supported by this browser.');
      }
    }

}
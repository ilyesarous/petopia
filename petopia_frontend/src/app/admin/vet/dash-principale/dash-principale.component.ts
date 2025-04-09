import { NotificationService } from 'src/app/services/vet/notifications/notification.service';
import { DiagnosisService } from 'src/app/services/vet/diagnoses/diagnosis.service';
import { PetGrowthsService } from 'src/app/services/vet/pet-growth/pet-growths.service';
import { ConsultationService } from 'src/app/services/vet/consultations/consultation.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { VetLocationService } from 'src/app/services/vet/location/vet-location.service';

@Component({
  selector: 'app-dash-principale',
  templateUrl: './dash-principale.component.html',
  styleUrls: ['./dash-principale.component.css'],
})
export class DashPrincipaleComponent implements OnInit , AfterViewInit{

  seenCount: number = 0; // Nombre de notifications vues
  unseenCount: number = 0; // Nombre de notifications non vues

  totalNotifications: number = 0;
  totalDiagnoses: number = 0;
  totalPetGrowths: number = 0;
  totalConsultations: number = 0;
  totalLocations: number = 0;

  private map: any;
  private marker: any;
  selectedLocation: string = '';
  vetLocations: any[] = [];
  addingMode = false;
  isSaving = false;

  //constructor(private notificationService: NotificationService) { }
  constructor(
    private notificationService: NotificationService,
    private diagnosisService: DiagnosisService,
    private petGrowthService: PetGrowthsService,
    private consultationService: ConsultationService,
    private vetLocationService: VetLocationService
  ) { }

  ngOnInit(): void {
    this.loadNotificationStats();
    this.loadTotalCounts();
    (window as any).deleteLocation = (id: number) => this.deleteLocation(id);
  }

  loadNotificationStats(): void {
    this.notificationService.getAllNotifications().subscribe(
      (notifications: any[]) => {
        console.log('Notifications:', notifications); // Les données sont bien récupérées
        this.seenCount = notifications.filter(n => n.seen).length;
        this.unseenCount = notifications.filter(n => !n.seen).length;
        console.log('Seen Count:', this.seenCount); // Doit afficher 2
        console.log('Unseen Count:', this.unseenCount); // Doit afficher 1
      },
      (error) => {
        console.error('Error fetching notifications', error);
      }
    );
  }

  loadTotalCounts(): void {
    // Récupérer le nombre total de notifications
    this.notificationService.getAllNotifications().subscribe(
      (notifications) => {
        this.totalNotifications = notifications.length;
      },
      (error) => {
        console.error('Error fetching notifications', error);
      }
    );

    // Récupérer le nombre total de diagnostics
    this.diagnosisService.getAllDiagnosis().subscribe(
      (diagnoses) => {
        this.totalDiagnoses = diagnoses.length;
      },
      (error) => {
        console.error('Error fetching diagnoses', error);
      }
    );

    // Récupérer le nombre total de suivis de croissance
    this.petGrowthService.getAllPetGrowths().subscribe(
      (petGrowths) => {
        this.totalPetGrowths = petGrowths.length;
      },
      (error) => {
        console.error('Error fetching pet growths', error);
      }
    );

    // Récupérer le nombre total de consultations
    this.consultationService.getAllConsultations().subscribe(
      (consultations) => {
        this.totalConsultations = consultations.length;
      },
      (error) => {
        console.error('Error fetching consultations', error);
      }
    );

    // Récupérer le nombre total de localisations
    this.vetLocationService.getAllLocations().subscribe(
      (locations) => {
        this.totalLocations = locations.length;
      },
      (error) => {
        console.error('Error fetching locations', error);
      }
    );
  }



        ngAfterViewInit(): void {
          this.initMap();
          this.loadVetLocations();
        }
        private loadVetLocations(): void {
          this.vetLocationService.getAllLocations().subscribe(locations => {
            // Nettoyer les marqueurs existants
            this.map.eachLayer((layer: any) => {
              if (layer instanceof L.Marker) {
                this.map.removeLayer(layer);
              }
            });
            
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
                  <div class="popup-actions">
                    <p style="color: #FF617C;" onclick="window.deleteLocation(${location.id})">
                      <i class="fas fa-trash"></i> Delete Location
                    </p>
                  </div>
                </div>
              `);
          });
        }
      
        toggleAddingMode(): void {
          if (this.addingMode) {
            // Si on était en mode ajout et qu'on clique pour annuler
            this.reloadMapData();
          }
          this.addingMode = !this.addingMode;
        }
        
        private reloadMapData(): void {
          // Supprimer tous les marqueurs existants
          this.map.eachLayer((layer: any) => {
            if (layer instanceof L.Marker) {
              this.map.removeLayer(layer);
            }
          });
        
          // Recharger les données depuis le serveur
          this.loadVetLocations();
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
          if (!this.addingMode) return;
        
          const userId = localStorage.getItem('userId');
          if (!userId) {
            alert('User ID not found');
            return;
          }
        
          // Ajouter un marqueur temporaire immédiatement
          const tempMarker = L.marker(e.latlng, {
            icon: L.divIcon({
              className: 'temp-marker',
              html: '<div style="color:red">...</div>',
              iconSize: [20, 20]
            })
          }).addTo(this.map)
            .bindPopup('Saving location...')
            .openPopup();
        
          // Récupérer l'adresse à partir des coordonnées
          fetch(`https://nominatim.openstreetmap.org/reverse?lat=${e.latlng.lat}&lon=${e.latlng.lng}&format=json`)
            .then(response => {
              if (!response.ok) throw new Error('Network response was not ok');
              return response.json();
            })
            .then(data => {
              const address = data.display_name || 'Address not available';
              
              // Créer l'objet location avec la structure attendue par le backend
              const newLocation = {
                latitude: e.latlng.lat,
                longitude: e.latlng.lng,
                address: address,
                vet: {
                  id_user: +userId  // Attention à bien envoyer un number, pas une string
                }
              };
        
              // Envoyer au backend
              this.vetLocationService.saveLocation(newLocation).subscribe({
                next: (savedLocation) => {
                  // Supprimer le marqueur temporaire
                  this.map.removeLayer(tempMarker);
                  
                  // Ajouter le nouveau marqueur permanent
                  L.marker([savedLocation.latitude, savedLocation.longitude])
                    .addTo(this.map)
                    .bindPopup(`
                      <b>Your Location</b><br>
                      ${savedLocation.address}
                    `);
                    
                  // Mettre à jour la liste
                  this.vetLocations.push(savedLocation);
                  this.addingMode = false;
                  this.selectedLocation = address;
                },
                error: (err) => {
                  this.map.removeLayer(tempMarker);
                  console.error('Error saving location:', err);
                }
              });
            })
            .catch(error => {
              this.map.removeLayer(tempMarker);
              console.error('Error getting address:', error);
              alert('Could not get address for this location. Please try another spot.');
            });
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
    
  
        // Ajoutez cette méthode à votre classe
  deleteLocation(id: number): void {
    if (confirm('Are you sure you want to delete this location?')) {
      this.vetLocationService.deleteLocation(id).subscribe({
        next: () => {
          // Supprimer le marqueur correspondant
          this.map.eachLayer((layer: any) => {
            if (layer instanceof L.Marker) {
              const markerLatLng = layer.getLatLng();
              const location = this.vetLocations.find(loc => 
                loc.latitude === markerLatLng.lat && 
                loc.longitude === markerLatLng.lng
              );
              
              if (location && location.id === id) {
                this.map.removeLayer(layer);
              }
            }
          });
  
          // Mettre à jour la liste des localisations
          this.vetLocations = this.vetLocations.filter(loc => loc.id !== id);
        },
        error: (err) => {
          console.error('Error deleting location:', err);
          alert('Failed to delete location');
        }
      });
    }
  }

}

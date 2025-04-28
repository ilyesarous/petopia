import { Component, OnInit } from '@angular/core';
import { ServiceAnimalService } from 'src/app/services/Event/service-animal.service';
import { ServiceAnimal, ServiceType } from 'src/app/models/EventModule/serviceAnimal';
import { Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-service-animal-list',
  templateUrl: './service-animal-list.component.html',
  styleUrls: ['./service-animal-list.component.css'] // Changed from .scss to .css
})
export class ServiceAnimalListComponent implements OnInit {
  services: ServiceAnimal[] = [];
  filteredServices: ServiceAnimal[] = [];
  searchTerm: string = '';
  selectedType: string = 'ALL';
  serviceTypes = Object.values(ServiceType);
  // Add these properties to your services component
showReservationModal = false;
selectedServiceId: number | null = null;



  constructor(private serviceAnimalService: ServiceAnimalService,
              private router: Router, // Inject Router if you need it for navigation
              private sanitizer: DomSanitizer

            ) {}

  ngOnInit(): void {
    this.loadServices();
  }
 

  // Add these methods to your services component
openReservationModal(serviceId: number): void {
  console.log('Opening modal for service:', serviceId);

  this.selectedServiceId = serviceId;
  this.showReservationModal = true;
}

closeReservationModal(): void {
  this.showReservationModal = false;
  this.selectedServiceId = null;
}

onReservationCreated(): void {
  this.closeReservationModal();
  // Optionally refresh your services or show a success message
}


  loadServices(): void {
    this.serviceAnimalService.getAllServiceAnimals().subscribe({
      next: (data) => {
        this.services = data;
        this.filteredServices = data;
      },
      error: (err) => console.error('Error fetching services:', err)
    });
  }

  filterServices(): void {
    this.filteredServices = this.services.filter(service => {
      const matchesSearch = service.descriptionServiceAnimal.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                          service.typeService.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesType = this.selectedType === 'ALL' || service.typeService === this.selectedType;
      return matchesSearch && matchesType;
    });
  }

   // Add this method to fix the resetFilters error
   resetFilters(): void {
    this.searchTerm = '';
    this.selectedType = 'ALL';
    this.filterServices();
  }
  deleteService(id: number): void {
    if (confirm('Are you sure you want to delete this service?')) {
      this.serviceAnimalService.deleteServiceAnimal(id).subscribe({
        next: () => {
          this.services = this.services.filter(s => s.idServiceAnimal !== id);
          this.filterServices();
        },
        error: (err) => console.error('Error deleting service:', err)
      });
    }
  }

  
  getServiceTypeClass(type: ServiceType): string {
    return type.toString();
  }
    // Add this method to fix the truncate pipe error
    truncateText(text: string, length: number): string {
      if (!text) return 'No description provided';
      return text.length > length ? text.substring(0, length) + '...' : text;
    }
  // getImageUrl(imagePath: string | undefined): SafeUrl | null {
  //   if (!imagePath) return null;
  //   const url = this.serviceAnimalService.getImageUrl(imagePath);
  //   return this.sanitizer.bypassSecurityTrustUrl(url);
  // }

  
  // Update the image error handler
  handleImageError(event: any, service: ServiceAnimal) {
    event.target.style.display = 'none';
    service.imagePath = undefined; // This fixes the type error
  }
  handleClose(): void {
    // Hide the form or perform other close actions
    this.showReservationModal = false;
  }
  // handleClose(): void {
  //   this.showReservationModal = false; // Use the correct property name here
  // }

  openReservationForm(serviceId: number): void {
    this.selectedServiceId = serviceId;
    this.showReservationModal = true; // Use the correct property name here
  }
}
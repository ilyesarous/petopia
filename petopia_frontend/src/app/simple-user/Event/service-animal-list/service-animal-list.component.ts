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


  constructor(private serviceAnimalService: ServiceAnimalService,
              private router: Router, // Inject Router if you need it for navigation
              private sanitizer: DomSanitizer

            ) {}

  ngOnInit(): void {
    this.loadServices();
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
  // getImageUrl(imagePath: string | undefined): SafeUrl | null {
  //   if (!imagePath) return null;
  //   const url = this.serviceAnimalService.getImageUrl(imagePath);
  //   return this.sanitizer.bypassSecurityTrustUrl(url);
  // }
  handleImageError(event: any) {
    event.target.style.display = 'none';
    // You could also set a default image here
}
}
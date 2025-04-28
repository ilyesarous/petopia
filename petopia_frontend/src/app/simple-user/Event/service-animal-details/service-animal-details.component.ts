import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServiceAnimalService } from 'src/app/services/Event/service-animal.service';
import { ServiceAnimal } from 'src/app/models/EventModule/serviceAnimal';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/user/auth.service';

@Component({
  selector: 'app-service-animal-details',
  templateUrl: './service-animal-details.component.html',
  styleUrls: ['./service-animal-details.component.css']
})
export class ServiceAnimalDetailsComponent implements OnInit {
  service: ServiceAnimal | undefined;
  isLoading = true;
  error: string | null = null;
  isBooking = false;
  selectedDate: Date | null = null;
  currentUserId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private serviceAnimalService: ServiceAnimalService,
    



  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadService(+id);
    } else {
      this.error = 'No service ID provided';
      this.isLoading = false;
    }
     
  }

  loadService(id: number): void {
    this.serviceAnimalService.getServiceAnimalById(id).subscribe({
      next: (data) => {
        this.service = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load service details';
        this.isLoading = false;
        console.error(err);
      }
    });
  }


}
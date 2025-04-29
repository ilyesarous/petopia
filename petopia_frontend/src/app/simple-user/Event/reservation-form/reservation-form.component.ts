import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReservationService } from 'src/app/services/Event/reservation.service';
import { Reservation } from 'src/app/models/EventModule/reservation';
import { AuthService } from 'src/app/services/user/auth.service';
import { ServiceAnimal } from 'src/app/models/EventModule/serviceAnimal'; // Import the ServiceAnimal model if needed
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
@Component({
  selector: 'app-reservation-form',
  templateUrl: './reservation-form.component.html',
  styleUrls: ['./reservation-form.component.css']
})
export class ReservationFormComponent implements OnInit {
  serviceId!: number;
  @Output() reservationCreated = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  reservationForm: FormGroup;
  isSubmitting = false;
  currentUserId: number | null = null;
  currentUserPhone: string | null = null; // Add this

  successMessage: string | null = null; // Add this line
  errorMessage: string | null = null;


  // Reservation model initialized with default values
  reservation: Reservation = {
    reservationDate: new Date(),
    serviceAnimal: { idServiceAnimal: this.serviceId } as any, // Will be replaced with actual input
    utilisateur: { id_user: this.currentUserId } as any, // Will be populated in ngOnInit
    status: 'PENDING',
    specialRequests: '',
    contactNumber: '' // Add this to match your form

  };

  constructor(
    private fb: FormBuilder,
    private reservationService: ReservationService,
    private authService: AuthService,
    private router: ActivatedRoute,
    private navigationRouter: Router // Add this

  ) {
    this.reservationForm = this.fb.group({
      reservationDate: ['', Validators.required],
      specialRequests: [''],
      contactNumber: [''] // Add this to your form group

      
    });
  }

  ngOnInit(): void {
    // Set default reservation date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    

    // Get current user ID from localStorage
    const userId = localStorage.getItem('userId');
    this.currentUserId = userId ? parseInt(userId, 10) : null;
    this.serviceId = Number(this.router.snapshot.paramMap.get('id'));
    console.log('Service ID from route:', this.serviceId);
        // Initialize form with default date
    this.reservationForm.patchValue({
      reservationDate: tomorrow.toISOString().substring(0, 16)
    });

    // Fetch user details including phone number using AuthService
    if (this.currentUserId) {
      this.authService.getUserById(this.currentUserId).subscribe({
        next: (userResponse) => {
          // Assuming the response has a phoneNumber property
          this.currentUserPhone = userResponse.phoneNumber;
          
          // Update form with user's phone number
          this.reservationForm.patchValue({
            contactNumber: this.currentUserPhone
          });
        },
        error: (err) => {
          console.error('Failed to fetch user details:', err);
          // Optionally show a message to the user
          this.errorMessage = 'Failed to load your contact information.';
        }
      });
    }

    // Update the default reservation with actual values
    this.reservation = {
      reservationDate: new Date(this.reservationForm.value.reservationDate),
      serviceAnimal: { idServiceAnimal: this.serviceId } as any,
      utilisateur: { id_user: this.currentUserId } as any,
      status: 'PENDING',
      specialRequests: this.reservationForm.value.specialRequests,
      contactNumber: this.currentUserPhone || '' // Include phone number

    };
  }

  onSubmit(): void {
    if (this.reservationForm.invalid || !this.currentUserId) {
      this.errorMessage = this.reservationForm.invalid ? 
        'Please fill in all required fields' : 'User not authenticated';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    // Create reservation data from form and default values
    const reservationData: Reservation = {
      serviceAnimal: { idServiceAnimal: this.serviceId } as any,
      utilisateur: { id_user: this.currentUserId } as any,
      reservationDate: new Date(this.reservationForm.value.reservationDate),
      status: 'PENDING',
      specialRequests: this.reservationForm.value.specialRequests,
      contactNumber: this.reservationForm.value.contactNumber // Include phone number

    };
console.log('Reservation Data:', reservationData);
    this.reservationService.createReservation(reservationData).subscribe({
      next: () => {
        this.reservationCreated.emit();
        this.resetForm();
        this.successMessage = 'Reservation created successfully!,The organizer has been notified.';

        // Redirect after 2 seconds (you can adjust this delay)
      setTimeout(() => {
        this.navigationRouter.navigate(['/services']); // Adjust the route as needed
      }, 4000);
        
      },
      error: (err) => {
        this.errorMessage = 'Failed to create reservation. Please try again.';
        console.error('Reservation error:', err);
        if (err.status === 403) {
          this.errorMessage = 'Access denied. Please make sure you are logged in and have the proper permissions.';
        }
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });


  }

  private resetForm(): void {
    this.reservationForm.reset();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.reservationForm.patchValue({
      reservationDate: tomorrow.toISOString().substring(0, 16),
      contactNumber: this.currentUserPhone || '' // Keep the phone number on reset

    });

    // Reset the default reservation as well
    this.reservation = {
      reservationDate: new Date(this.reservationForm.value.reservationDate),
      serviceAnimal: { idServiceAnimal: this.serviceId } as any,
      utilisateur: { id_user: this.currentUserId } as any,
      status: 'PENDING',
      specialRequests: this.reservationForm.value.specialRequests,
      contactNumber: this.currentUserPhone || '' // Include phone number

    };
  }

  onClose(event?: Event): void {
    if (event) {
      event.stopPropagation(); // Add this to prevent any potential parent event triggers
    }
    this.close.emit();
  }
}
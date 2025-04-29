import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from 'src/app/services/Event/event.service';
import { AuthService } from 'src/app/services/user/auth.service'; // Importer AuthService
import { Participation } from 'src/app/models/EventModule/participation'; // Assurez-vous que le chemin est correct
import { ParticipationService } from 'src/app/services/Event/participation.service';
import { Event } from 'src/app/models/EventModule/appevent'; // Assurez-vous que le chemin est correct

import { ViewChild, ElementRef } from '@angular/core';
import { EventNotification, EventNotificationService } from 'src/app/services/Event/EventNotification';
import { Subscription } from 'rxjs';
import { CalendarOptions, EventApi } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FullCalendarModule } from '@fullcalendar/angular';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);


declare var bootstrap: any; 
@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
  
})
export class EventListComponent implements OnInit {
  events: any[] = [];
  isAdmin: boolean = false; // Variable pour savoir si l'utilisateur est un admin
  selectedEvent: Event | null = null; // L'événement sélectionné pour participer
  @ViewChild('editEventModal') editEventModal!: ElementRef;
  role: string = '';
  editMode: boolean = false;  // Pour contrôler l’affichage du formulaire d’édition
  eventToEdit: Event | null = null;  // Contient l’événement à modifier
  showParticipationPopup: boolean = false;
  notifications: EventNotification[] = [];
// Add these properties to your component class
showImageModal: boolean = false;
currentImageUrl: string = '';
showThumbnails: boolean = true; // Set to false if you prefer buttons only


// Statistics properties
stats: any = null;
@ViewChild('eventsByTypeChart') eventsByTypeChartRef!: ElementRef;
@ViewChild('monthlyParticipationChart') monthlyParticipationChartRef!: ElementRef;
eventsByTypeChart: any;
monthlyParticipationChart: any;


  filters: any = {};


  showCalendar: boolean = false;
calendarOptions: CalendarOptions = {
  initialView: 'dayGridMonth',
  plugins: [dayGridPlugin, interactionPlugin],
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,dayGridWeek,dayGridDay'
  },
  events: [],
  eventClick: this.handleEventClick.bind(this),
  eventDisplay: 'block',
  height: 'auto', // Add this
  contentHeight: 'auto', // Add this
  aspectRatio: 1.5 // Adjust this as needed
};


  private notificationSubscription!: Subscription;
  private eventsSubscription!: Subscription;
  private roleSubscription!: Subscription;

  
  filtersExpanded: boolean = false;
  eventTypes = [
    { value: 'PROMENADE', label: 'Promenade' },
    { value: 'RANDONNEE', label: 'Randonnée' },
    { value: 'PHOTO_SEANCE', label: 'Séance photo' }
  ];
  statusOptions = [
    { value: 'ACTIF', label: 'Actif' },
    { value: 'ANNULE', label: 'Annulé' },
    { value: 'TERMINE', label: 'Terminé' }
  ];


  
  constructor(private eventService: EventService,
                private router: Router,
                private authService: AuthService, 
                private participationService: ParticipationService,
                private notificationService: EventNotificationService) {}

  ngOnInit(): void {
          // Pour chaque événement, récupérer l'organisateur si c'est un ID
          this.events.forEach(event => {
            // if (typeof event.organisateur === 'number') {  // Si l'organisateur est un ID
              this.authService.getUserById(event.organisateur).subscribe(user => {
                event.organisateur = user;  // Remplacer l'ID par l'objet user
              // });
            }) });

            this.authService.role.subscribe((role) => {
              this.role = role || ''; // Ensure role is never undefined
            });
        
        // Se abonner à l'observable pour recevoir les mises à jour en temps réel
        this.eventService.events$.subscribe((data) => {
          this.events = data;  // Met à jour la liste des événements
          if (this.role === 'ROLE_ADMIN') {
            this.calculateStatistics();
          }
        });

        // Charger les événements au démarrage
        this.eventService.loadEvents();

        // Vérifier si l'utilisateur est un admin  


            // ✅ Subscribe to notifications
    this.notificationService.getNotifications().subscribe((notifs) => {
      this.notifications = notifs;
    });
    //this.setupSubscriptions();

}

// ngOnDestroy(): void {
//   this.cleanupSubscriptions();
// }

// private setupSubscriptions(): void {
//   this.roleSubscription = this.authService.role.subscribe((role) => {
//     this.role = role || '';
//   });

//   this.eventsSubscription = this.eventService.events$.subscribe((data) => {
//     this.events = data;
//     this.loadOrganizers();
//   });

//   this.notificationSubscription = this.notificationService.getNotifications().subscribe((notifs) => {
//     this.notifications = notifs;
//   });
// }

// private loadOrganizers(): void {
//   this.events.forEach(event => {
//     if (event.organisateur) {
//       this.authService.getUserById(event.organisateur).subscribe(user => {
//         event.organisateur = user;
//       });
//     }
//   });
// }

// private cleanupSubscriptions(): void {
//   this.roleSubscription?.unsubscribe();
//   this.eventsSubscription?.unsubscribe();
//   this.notificationSubscription?.unsubscribe();
// }



// Add this method
openImageModal(imageUrl: string): void {
  this.currentImageUrl = imageUrl;
  this.showImageModal = true;
  document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open

}

closeImageModal(): void {
  this.showImageModal = false;
  document.body.style.overflow = ''; // Re-enable scrolling

}
// In event-list.component.ts
getAvailablePlaces(event: Event): number {
  if (!event.participations || event.participations.length === 0) {
    return event.placesMaxEvent;
  }
  
  return event.placesMaxEvent - event.participations.length;
}
clearNotifications() {
  this.notifications = [];
}

dismissNotification(notification: any) {
  this.notifications = this.notifications.filter(n => n !== notification);
}
  loadEvents() {
    
    this.eventService.getEvents().subscribe(
      (data) => {
        this.events = data;
      },
      (error) => {
        console.error("Erreur lors du chargement des événements :", error);
      }
    );
  }
  
  goToAddEvent() {
    this.router.navigate(['/add-event']);
  }

  // Méthode pour supprimer un événement
  deleteEvent(idEvent: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      this.eventService.deleteEvent(idEvent).subscribe({
        next: () => {
          // Supprime l'événement localement après suppression réussie du backend
          this.events = this.events.filter(event => event.idEvent !== idEvent);
          alert('Événement supprimé avec succès');
        },
        error: (err) => {
          console.error('Erreur de suppression', err);
          alert('Une erreur est survenue lors de la suppression de l\'événement');
        }
      });
    }
}
 // Méthode pour sélectionner un événement et afficher le formulaire
 // Fonction pour afficher le formulaire de participation
 selectEvent(event: Event): void {
  this.selectedEvent = event;
  this.showParticipationPopup = true;
}
// Méthode pour réinitialiser la sélection
closeForm(): void {
  this.selectedEvent = null;
}

closeParticipationForm(): void {
  this.selectedEvent = null; 
  this.showParticipationPopup = false;// Fermer le formulaire (réinitialiser l'événement sélectionné)
}

// Méthode pour modifier un événement
updateEvent(): void {
  if (this.eventToEdit) {



    this.eventService.updateEvent(this.eventToEdit.idEvent, this.eventToEdit).subscribe({
      next: () => {
        alert('Événement mis à jour avec succès');
        this.editMode = false;  // Fermer le formulaire après la mise à jour
        this.eventToEdit = null; // Réinitialiser l'événement à modifier
        this.eventService.loadEvents(); // Recharger la liste des événements
        console.log('Mise à jour de l\'événement :', this.eventToEdit);

      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour :', err);
        alert('Erreur lors de la mise à jour');
      }
    });
  } else {
    alert('Aucun événement sélectionné à modifier');
  }
}

editEvent(event: Event): void {
  this.eventToEdit = { ...event }; // Clone
  setTimeout(() => {
    const modal = new bootstrap.Modal(document.getElementById('editEventModal'));
    modal.show();
  }, 0);
}

cancelEdit(): void {
  this.eventToEdit = null;
  this.editMode = false;
}

// saveUpdatedEvent(): void {
//   if (this.eventToEdit) {
//     this.eventService.updateEvent(this.eventToEdit.idEvent, this.eventToEdit).subscribe({
//       next: () => {
//         alert('Événement mis à jour avec succès');
//         this.editMode = false;
//         this.eventToEdit = null;
//         this.eventService.loadEvents();
//       },
//       error: (err) => {
//         console.error('Erreur de mise à jour', err);
//         alert('Erreur lors de la mise à jour');
//       }
//     });
//   }
// }

saveUpdatedEvent(): void {
  if (this.eventToEdit) {
    this.eventService.updateEvent(this.eventToEdit.idEvent, this.eventToEdit).subscribe({
      next: (updatedEvent) => {
        // Update the specific event in the array
        const index = this.events.findIndex(e => e.idEvent === updatedEvent.idEvent);
        if (index !== -1) {
          this.events[index] = updatedEvent;
        }
        
        // Properly close the modal
        const modalElement = document.getElementById('editEventModal');
        if (modalElement) {
          document.activeElement && (document.activeElement as HTMLElement).blur(); // retire le focus

          const modal = bootstrap.Modal.getInstance(modalElement);
          modal?.hide();
          modalElement.removeAttribute('aria-hidden'); // Fix accessibility warning
        }
        
        alert('Événement mis à jour avec succès');
      },
      error: (err) => {
        console.error('Erreur de mise à jour', err);
        alert('Erreur lors de la mise à jour');
      }
    });
  }
}

toggleDetails(event: any): void {
  event.showDetails = !event.showDetails;
}


// Dans la classe EventListComponent
viewParticipants(eventId: number): void {
  this.router.navigate(['/dashboard/event-participants', eventId]);
}


applyFilters(): void {
  this.eventService.filterEvents(this.filters).subscribe();
}

resetFilters(): void {
  this.filters = {};
  this.eventService.loadEvents();
}





toggleFilterExpansion() {
  this.filtersExpanded = !this.filtersExpanded;
}



toggleCalendarView(): void {
  // this.showCalendar = true;
  
  // // Convert events to FullCalendar format
  // this.calendarOptions.events = this.events.map(event => ({
  //   id: event.idEvent.toString(),
  //   title: event.nameEvent,
  //   start: event.dateEvent,
  //   extendedProps: {
  //     location: event.lieuEvent,
  //     description: event.descriptionEvent,
  //     status: event.statusEvent
  //   },
  //   backgroundColor: this.getEventColor(event.statusEvent),
  //   borderColor: this.getEventColor(event.statusEvent)
  // }));
  
  
  // // Show the modal
  // setTimeout(() => {
  //   const modal = new bootstrap.Modal(document.getElementById('calendarModal'));
  //   modal.show();
  // }, 0);


  this.showCalendar = true;
  
  // Convert events to FullCalendar format
  this.calendarOptions.events = this.events.map(event => ({
    id: event.idEvent.toString(),
    title: event.nameEvent,
    start: event.dateEvent,
    extendedProps: {
      location: event.lieuEvent,
      description: event.descriptionEvent,
      status: event.statusEvent
    },
    backgroundColor: this.getEventColor(event.statusEvent),
    borderColor: this.getEventColor(event.statusEvent)
  }));
  // Show the modal and trigger a resize event after a small delay
  setTimeout(() => {
    const modal = new bootstrap.Modal(document.getElementById('calendarModal'));
    modal.show();
    
    // This forces FullCalendar to recalculate its dimensions
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100);
  }, 0);

}

private getEventColor(status: string): string {
  switch(status) {
    case 'ACTIF': return '#28a745'; // Green
    case 'ANNULE': return '#dc3545'; // Red
    case 'TERMINE': return '#6c757d'; // Gray
    default: return '#17a2b8'; // Blue
  }
}

handleEventClick(clickInfo: { event: EventApi }): void {
  const eventId = clickInfo.event.id;
  const event = this.events.find(e => e.idEvent.toString() === eventId);
  
  if (event) {
    // Close calendar modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('calendarModal'));
    modal?.hide();
    
    // Scroll to the event in the list
    const element = document.getElementById(`event-${eventId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      
      // Highlight the event temporarily
      element.classList.add('highlight-event');
      setTimeout(() => {
        element.classList.remove('highlight-event');
      }, 3000);
    }
  }
}

// Add this method to your EventListComponent class
openMap(location: string): void {
  if (!location) {
    alert('No location specified for this event');
    return;
  }

  // Encode the location for URL
  const encodedLocation = encodeURIComponent(location);
  
  // Open Google Maps with the location
  window.open(`https://www.google.com/maps/search/?api=1&query=${encodedLocation}`, '_blank');
}



// private calculateStatistics(): void {
//   if (!this.events || this.events.length === 0) {
//     this.stats = null;
//     return;
//   }

//   // Calculate basic stats
//   const totalEvents = this.events.length;
//   const activeEvents = this.events.filter(e => e.statusEvent === 'ACTIF').length;
  
//   // Calculate total participants across all events
//   const totalParticipants = this.events.reduce((sum, event) => {
//     return sum + (event.participations?.length || 0);
//   }, 0);
  
//   // Calculate total revenue (assuming prixEvent is the price per participant)
//   const totalRevenue = this.events.reduce((sum, event) => {
//     return sum + (event.prixEvent * (event.participations?.length || 0));
//   }, 0);
  
//   // Calculate events by type
//   const eventsByType = this.calculateEventsByType();
  
//   // Calculate monthly participation
//   const monthlyParticipation = this.calculateMonthlyParticipation();

//   this.stats = {
//     totalEvents,
//     activeEvents,
//     totalParticipants,
//     totalRevenue,
//     eventsByType,
//     monthlyParticipation
//   };

//   this.initCharts();
// }

private calculateStatistics(): void {
  if (!this.events || this.events.length === 0) {
    this.stats = null;
    return;
  }

  
  console.log("Debugging revenue calculation:");
  console.log("Sample event:", {
    name: this.events[0].nameEvent,
    price: this.events[0].prixEvent,
    participations: this.events[0].participations,
    status: this.events[0].statusEvent
  });



  // Calculate basic stats
  const totalEvents = this.events.length;
  const activeEvents = this.events.filter(e => e.statusEvent === 'ACTIF').length;
  const canceledEvents = this.events.filter(e => e.statusEvent === 'ANNULE').length;
  
  // Calculate total revenue (only for active events)
  const totalRevenue = this.events.reduce((sum, event) => {
    if (event.statusEvent !== 'ACTIF' || !event.prixEvent) return sum;
    
    const eventPrice = Number(event.prixEvent) ;
    if (isNaN(eventPrice)) return sum;

    let eventParticipants = 0;
    
    if (Array.isArray(event.participations)) {
      eventParticipants = event.participations.length;
    } else if (typeof event.participations === 'number') {
      eventParticipants = event.participations;
    } else if (event.availablePlaces !== undefined && event.placesMaxEvent !== undefined) {
      eventParticipants = event.placesMaxEvent - event.availablePlaces;
    }
    console.log(`Event: ${event.nameEvent}, Price: ${eventPrice}, Participants: ${eventParticipants}, Revenue: ${eventPrice * eventParticipants}`);
    
    return sum + (eventPrice * eventParticipants);
  }, 0);
  
  // Calculate events by type (only active events)
  const eventsByType = this.calculateEventsByType();
  
  // Calculate monthly participation (only active events)
  const monthlyParticipation = this.calculateMonthlyParticipation();

  this.stats = {
    totalEvents,
    activeEvents,
    canceledEvents, // Changed from totalParticipants
    totalRevenue,
    eventsByType,
    monthlyParticipation
  };

  this.debugMonthlyData(); // Add this line

  this.initCharts();
}

private calculateEventsByType(): any[] {
  // Initialize all types with 0 count
  const typeCounts = this.eventTypes.reduce((acc, type) => {
    acc[type.value] = 0;
    return acc;
  }, {} as Record<string, number>);
  
  // Count active events by type
  this.events
    .filter(event => event.statusEvent === 'ACTIF')
    .forEach(event => {
      if (event.eventType in typeCounts) {
        typeCounts[event.eventType]++;
      }
    });
  
  // Convert to array format
  return Object.entries(typeCounts).map(([type, count]) => ({
    type,
    count
  }));
}

// private calculateMonthlyParticipation(): any[] {
//   const monthCounts: {[key: string]: number} = {};
//   const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
//   // Initialize all months with 0
//   monthNames.forEach(month => {
//     monthCounts[month] = 0;
//   });

//   // Count participations per month
//   this.events.forEach(event => {
//     if (event.participations && event.participations.length > 0) {
//       const eventDate = new Date(event.dateEvent);
//       const month = monthNames[eventDate.getMonth()];
//       monthCounts[month] += event.participations.length;
//     }
//   });
  
//   return monthNames.map(month => ({
//     month,
//     count: monthCounts[month]
//   }));
// }
private calculateMonthlyParticipation(): any[] {
  const monthCounts: {[key: string]: number} = {};
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                     'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Initialize all months with 0
  monthNames.forEach(month => {
    monthCounts[month] = 0;
  });

  // Process each active event
  this.events
    .filter(event => event.statusEvent === 'ACTIF')
    .forEach(event => {
      try {
        // Get participant count
        let participants = 0;
        if (Array.isArray(event.participations)) {
          participants = event.participations.length;
        } else if (typeof event.participations === 'number') {
          participants = event.participations;
        } else if (event.placesMaxEvent !== undefined && event.availablePlaces !== undefined) {
          participants = event.placesMaxEvent - event.availablePlaces;
        }

        // Only process if we have participants and a valid date
        if (participants > 0 && event.dateEvent) {
          const eventDate = new Date(event.dateEvent);
          if (!isNaN(eventDate.getTime())) {
            const monthName = monthNames[eventDate.getMonth()];
            monthCounts[monthName] += participants;
          }
        }
      } catch (e) {
        console.error('Error processing event:', event, e);
      }
    });

  // Convert to array format
  return monthNames.map(month => ({
    month,
    count: monthCounts[month]
  }));
}

private initCharts(): void {
  setTimeout(() => {
    if (this.stats?.eventsByType && this.stats.eventsByType.length > 0) {
      this.createEventsByTypeChart();
    }
    
    if (this.stats?.monthlyParticipation && this.stats.monthlyParticipation.length > 0) {
      this.createMonthlyParticipationChart();
    }
  }, 0);
}

// private createEventsByTypeChart(): void {
//   const ctx = this.eventsByTypeChartRef?.nativeElement.getContext('2d');
//   if (!ctx) return;

//   if (this.eventsByTypeChart) {
//     this.eventsByTypeChart.destroy();
//   }

//   const labels = this.stats.eventsByType.map((item: any) => item.type);
//   const data = this.stats.eventsByType.map((item: any) => item.count);

//   this.eventsByTypeChart = new Chart(ctx, {
//     type: 'doughnut',
//     data: {
//       labels: labels,
//       datasets: [{
//         data: data,
//         backgroundColor: [
//           '#4e73df',
//           '#1cc88a',
//           '#36b9cc',
//           '#f6c23e'
//         ],
//         hoverBackgroundColor: [
//           '#2e59d9',
//           '#17a673',
//           '#2c9faf',
//           '#dda20a'
//         ],
//         hoverBorderColor: "rgba(234, 236, 244, 1)",
//       }]
//     },
//     options: {
//       maintainAspectRatio: false,
//       plugins: {
//         legend: {
//           position: 'right'
//         }
//       },
//       cutout: '70%'
//     }
//   });
// }

private createEventsByTypeChart(): void {
  const ctx = this.eventsByTypeChartRef?.nativeElement.getContext('2d');
  if (!ctx) return;

  if (this.eventsByTypeChart) {
    this.eventsByTypeChart.destroy();
  }

  const labels = this.stats.eventsByType.map((item: any) => {
    // Map the internal values to display labels
    const type = this.eventTypes.find(t => t.value === item.type);
    return type ? type.label : item.type;
  });
  
  const data = this.stats.eventsByType.map((item: any) => item.count);

  this.eventsByTypeChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: [
          '#4e73df',  // Promenade
          '#1cc88a',  // Randonnée
          '#f6c23e',  // Séance Photo
          '#36b9cc'   // Additional color if needed
        ],
        hoverBackgroundColor: [
          '#2e59d9',
          '#17a673',
          '#dda20a',
          '#2c9faf'
        ],
        hoverBorderColor: "rgba(234, 236, 244, 1)",
      }]
    },
    options: {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            usePointStyle: true,
            pointStyle: 'circle'
          }
        }
      },
      cutout: '70%'
    }
  });
}

// private createMonthlyParticipationChart(): void {
//   const ctx = this.monthlyParticipationChartRef?.nativeElement.getContext('2d');
//   if (!ctx) return;

//   if (this.monthlyParticipationChart) {
//     this.monthlyParticipationChart.destroy();
//   }

//   const labels = this.stats.monthlyParticipation.map((item: any) => item.month);
//   const data = this.stats.monthlyParticipation.map((item: any) => item.count);

//   this.monthlyParticipationChart = new Chart(ctx, {
//     type: 'bar',
//     data: {
//       labels: labels,
//       datasets: [{
//         label: "Participants",
//         backgroundColor: "#4e73df",
//         hoverBackgroundColor: "#2e59d9",
//         borderColor: "#4e73df",
//         data: data,
//       }]
//     },
//     options: {
//       maintainAspectRatio: false,
//       scales: {
//         y: {
//           beginAtZero: true
//         }
//       }
//     }
//   });
// }

// private createMonthlyParticipationChart(): void {
//   const ctx = this.monthlyParticipationChartRef?.nativeElement.getContext('2d');
//   if (!ctx) return;

//   // Destroy previous chart if exists
//   if (this.monthlyParticipationChart) {
//     this.monthlyParticipationChart.destroy();
//   }

//   // Prepare data
//   const labels = this.stats.monthlyParticipation.map(item => item.month);
//   const data = this.stats.monthlyParticipation.map(item => item.count);

//   // Create new chart
//   this.monthlyParticipationChart = new Chart(ctx, {
//     type: 'bar',
//     data: {
//       labels: labels,
//       datasets: [{
//         label: "Participants",
//         backgroundColor: "#4e73df",
//         hoverBackgroundColor: "#2e59d9",
//         borderColor: "#4e73df",
//         borderWidth: 1,
//         data: data,
//       }]
//     },
//     options: {
//       responsive: true,
//       maintainAspectRatio: false,
//       plugins: {
//         tooltip: {
//           callbacks: {
//             label: (context) => `${context.parsed.y} participants`
//           }
//         }
//       },
//       scales: {
//         y: {
//           beginAtZero: true,
//           title: {
//             display: true,
//             text: 'Number of Participants'
//           }
//         },
//         x: {
//           title: {
//             display: true,
//             text: 'Month'
//           }
//         }
//       }
//     }
//   });
// }

private createMonthlyParticipationChart(): void {
  const ctx = this.monthlyParticipationChartRef?.nativeElement.getContext('2d');
  if (!ctx) return;

  // Destroy previous chart if exists
  if (this.monthlyParticipationChart) {
    this.monthlyParticipationChart.destroy();
  }

  // Define interface for monthly participation data
  interface MonthlyParticipation {
    month: string;
    count: number;
  }

  // Prepare data with proper typing
  const labels = this.stats.monthlyParticipation.map((item: MonthlyParticipation) => item.month);
  const data = this.stats.monthlyParticipation.map((item: MonthlyParticipation) => item.count);

  // Create new chart
  this.monthlyParticipationChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: "Participants",
        backgroundColor: "#4e73df",
        hoverBackgroundColor: "#2e59d9",
        borderColor: "#4e73df",
        borderWidth: 1,
        data: data,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          callbacks: {
            label: (context: { parsed: { y: number } }) => `${context.parsed.y} participants`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Number of Participants'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Month'
          }
        }
      }
    }
  });
}
debugMonthlyData(): void {
  console.log("Monthly Participation Data:", this.stats.monthlyParticipation);
  console.log("All Events:", this.events.map(event => ({
    name: event.nameEvent,
    date: event.dateEvent,
    participants: Array.isArray(event.participations) ? event.participations.length : 
                 typeof event.participations === 'number' ? event.participations :
                 event.placesMaxEvent - event.availablePlaces,
    status: event.statusEvent
  })));
}

}


  




import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from 'src/app/services/Event/event.service';
import { Event } from 'src/app/models/EventModule/appevent'; // Assurez-vous que le chemin est correct


@Component({
  selector: 'app-event-edit',
  templateUrl: './event-edit.component.html',
  styleUrls: ['./event-edit.component.css']
})
export class EventEditComponent {
  event!: Event;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.eventService.getEventById(id).subscribe(
      data => this.event = data,
      error => console.error(error)
    );
  }
  
  onSubmit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.eventService.updateEvent(id, this.event).subscribe({
      next: () => this.router.navigate(['/events']), // redirige après update
      error: err => console.error(err)
    });
  }
  
}

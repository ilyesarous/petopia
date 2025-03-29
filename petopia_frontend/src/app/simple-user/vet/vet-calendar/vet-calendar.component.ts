import { Component, OnInit } from '@angular/core';
import { ConsultationService } from 'src/app/services/vet/consultations/consultation.service';
import { Consultation } from 'src/app/models/vet/consultation';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

interface CustomEventInput extends EventInput {
  id: string;
  extendedProps: {
    client: string;
    pet: string;
    type: string;
    status: string;
    price: number;
  };
}

@Component({
  selector: 'app-vet-calendar',
  templateUrl: './vet-calendar.component.html',
  styleUrls: ['./vet-calendar.component.css']
})
export class VetCalendarComponent implements OnInit {
  consultations: Consultation[] = [];
  showModal: boolean = false;
  selectedConsultation: Consultation | null = null;
  calendarOptions: CalendarOptions = {
    initialView: 'timeGridWeek',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    events: [] as CustomEventInput[],
    eventColor: '#F83182',
    eventTextColor: '#fff',
    eventTimeFormat: { 
      hour: '2-digit',
      minute: '2-digit',
      meridiem: false,
      hour12: false
    },
    slotMinTime: '08:00:00',
    slotMaxTime: '20:00:00',
    dayHeaderFormat: { weekday: 'short', day: 'numeric' },
    editable: true,
    selectable: true,
    weekends: true,
    height: 'auto',
    eventClick: this.handleEventClick.bind(this),
    eventDrop: this.handleEventDrop.bind(this),
    eventResize: this.handleEventResize.bind(this)
  };

  constructor(private consultationService: ConsultationService) { }

  ngOnInit(): void {
    this.loadConsultations();
  }

  loadConsultations(): void {
    this.consultationService.getAllConsultations().subscribe(
      (data: Consultation[]) => {
        this.consultations = data;
        this.calendarOptions.events = this.mapConsultationsToEvents(data);
      },
      error => {
        console.error('Error loading consultations:', error);
      }
    );
  }

  mapConsultationsToEvents(consultations: Consultation[]): CustomEventInput[] {
    return consultations.map(consultation => {
      let eventColor = '#F83182';
      
      if (consultation.statusT === 'accepted') {
        eventColor = '#FE9A7A';
      } else if (consultation.statusT === 'refused') {
        eventColor = '#FF0000';
      }

      return {
        id: consultation.idConsultation.toString(),
        title: `${consultation.petconsultation.petName} - ${consultation.consultationT}`,
        start: `${consultation.consultation_date}T${consultation.start_time}`,
        end: `${consultation.consultation_date}T${consultation.end_time}`,
        color: eventColor,
        extendedProps: {
          client: consultation.userclient.name,
          pet: consultation.petconsultation.petName,
          type: consultation.consultationT,
          status: consultation.statusT,
          price: consultation.consultation_price
        }
      };
    });
  }

  handleEventDrop(dropInfo: any): void {
    console.log('Event dropped', dropInfo);
  }

  handleEventResize(resizeInfo: any): void {
    console.log('Event resized', resizeInfo);
  }

  handleEventClick(clickInfo: any): void {
    const consultationId = parseInt(clickInfo.event.id);
    this.selectedConsultation = this.consultations.find(c => c.idConsultation === consultationId) || null;
    
    if (this.selectedConsultation) {
      this.showModal = true;
    }
  }

  onStatusUpdated(newStatus: string): void {
    if (this.selectedConsultation) {
      this.consultationService.updateConsultationStatus(
        this.selectedConsultation.idConsultation, 
        newStatus
      ).subscribe({
        next: (updatedConsultation) => {
          // Mise à jour locale seulement après confirmation du backend
          const index = this.consultations.findIndex(
            c => c.idConsultation === this.selectedConsultation?.idConsultation
          );
          if (index !== -1) {
            this.consultations[index].statusT = newStatus;
            this.updateCalendarEvent(newStatus);
          }
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour:', err);
          // Revenir à l'ancien statut en cas d'erreur
          this.updateCalendarEvent(this.selectedConsultation?.statusT || 'waiting');
        }
      });
    }
  }
  
  private updateCalendarEvent(status: string): void {
    const events = this.calendarOptions.events as any[];
    const eventIndex = events?.findIndex(
      e => e.id === this.selectedConsultation?.idConsultation.toString()
    );
    
    if (eventIndex !== undefined && eventIndex !== -1 && events) {
      events[eventIndex] = {
        ...events[eventIndex],
        color: this.getStatusColor(status),
        extendedProps: {
          ...events[eventIndex].extendedProps,
          status: status
        }
      };
      this.calendarOptions.events = [...events];
    }
  }

  private getStatusColor(status: string): string {
    switch (status) {
      case 'accepted': return '#FE9A7A';
      case 'refused': return '#FF0000';
      default: return '#F83182';
    }
  }

  private updateConsultationStatus(id: number, status: string): void {
    this.consultationService.updateConsultationStatus(id, status).subscribe({
      next: () => {
        console.log('Status updated successfully');
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour du statut:', err);
      }
    });
  }
}
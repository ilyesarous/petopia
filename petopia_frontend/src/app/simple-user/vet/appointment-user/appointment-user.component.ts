import { Component, OnInit } from '@angular/core';
import { ConsultationService } from 'src/app/services/vet/consultations/consultation.service';
import { Consultation } from 'src/app/models/vet/consultation';

@Component({
  selector: 'app-appointment-user',
  templateUrl: './appointment-user.component.html',
  styleUrls: ['./appointment-user.component.css']
})
export class AppointmentUserComponent implements OnInit {
  upcomingConsultations: Consultation[] = [];
  pastConsultations: Consultation[] = [];
  selectedPetId: number | null = null;
  selectedDate: string = '';
  selectedTime: string = '';
  consultationType: string = 'at_vet';
  endTime: string = '';

  constructor(private consultationService: ConsultationService) { }

  ngOnInit(): void {
    this.loadConsultations();
    this.initTabSwitching();
  }

  loadConsultations(): void {
    this.consultationService.getAllConsultations().subscribe({
      next: (consultations) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        this.upcomingConsultations = consultations.filter(c => {
          const consultationDate = new Date(c.consultation_date);
          return consultationDate >= today;
        }).sort((a, b) => {
          return new Date(a.consultation_date).getTime() - new Date(b.consultation_date).getTime();
        });

        this.pastConsultations = consultations.filter(c => {
          const consultationDate = new Date(c.consultation_date);
          return consultationDate < today;
        }).sort((a, b) => {
          return new Date(b.consultation_date).getTime() - new Date(a.consultation_date).getTime();
        });
      },
      error: (err) => {
        console.error('Error loading consultations:', err);
      }
    });
  }

  submitAppointment(): void {
    if (!this.selectedPetId || !this.selectedDate || !this.selectedTime || !this.endTime) {
      alert('Please fill all required fields');
      return;
    }

    const newConsultation = {
      consultation_date: this.selectedDate,
      start_time: this.selectedTime,
      end_time: this.endTime,
      consultationT: this.consultationType,
      statusT: 'waiting',
      consultation_price: 50,
      petconsultation: { idPet: this.selectedPetId },
      userclient: { id_user: 2 },
      uservet: { id_user: 1 }
    };

    this.consultationService.addConsultation(newConsultation).subscribe({
      next: (response) => {
        alert('Appointment created successfully!');
        this.loadConsultations();
        this.resetForm();
        window.location.replace('home/vet/appointment-user');
      },
      error: (err) => {
        console.error('Error creating appointment:', err);
        alert('Error creating appointment');
      }
    });
  }

  private resetForm(): void {
    this.selectedPetId = null;
    this.selectedDate = '';
    this.selectedTime = '';
    this.endTime = '';
  }

  getConsultationType(type: string): string {
    return type === 'meet' ? 'Online Consultation' : 'At Clinic Consultation';
  }
  
  getStatusClass(status: string): string {
    return status.toLowerCase();
  }

  initTabSwitching() {
    const mesRdvTab = document.getElementById('mes-rdv-tab');
    const prendreRdvTab = document.getElementById('prendre-rdv-tab');
    const mesRdvContent = document.getElementById('mes-rdv-content');
    const prendreRdvContent = document.getElementById('prendre-rdv-content');

    if (mesRdvTab && prendreRdvTab && mesRdvContent && prendreRdvContent) {
      mesRdvTab.addEventListener('click', () => {
        mesRdvContent.classList.remove('hidden');
        prendreRdvContent.classList.add('hidden');
        mesRdvTab.classList.add('active');
        prendreRdvTab.classList.remove('active');
      });
      
      prendreRdvTab.addEventListener('click', () => {
        prendreRdvContent.classList.remove('hidden');
        mesRdvContent.classList.add('hidden');
        prendreRdvTab.classList.add('active');
        mesRdvTab.classList.remove('active');
      });
    }
  }

  calculateEndTime(): void {
    if (!this.selectedTime) return;

    const timeParts = this.selectedTime.split(':');
    let hours = parseInt(timeParts[0]);
    let minutes = parseInt(timeParts[1]);
    
    minutes += 30;
    if (minutes >= 60) {
      hours += 1;
      minutes -= 60;
    }
    
    this.endTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  cancelAppointment(id: number): void {
    if (confirm('Are you sure you want to cancel and delete this appointment?')) {
      this.consultationService.deleteConsultation(id).subscribe({
        next: () => {
          this.loadConsultations(); // Recharger la liste après suppression
        },
        error: (err) => {
          console.error('Error deleting appointment:', err);
          alert('Error deleting appointment');
        }
      });
    }
  }
  
}
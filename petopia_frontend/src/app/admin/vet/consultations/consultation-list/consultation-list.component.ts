import { Component } from '@angular/core';
import { Consultation } from 'src/app/models/vet/consultation';
import { ConsultationService } from 'src/app/services/vet/consultations/consultation.service';

@Component({
  selector: 'app-consultation-list',
  templateUrl: './consultation-list.component.html',
  styleUrls: ['./consultation-list.component.css']
})
export class ConsultationListComponent {

  consultations: Consultation[] = [];
  selectedConsultation: Consultation | null = null;
  sortDirection: 'asc' | 'desc' = 'asc'; // Direction du tri

  // var pagination
  p: number = 1; // Page actuelle
  itemsPerPage: number = 3; // Nombre d'éléments par page

  constructor(private consultationService: ConsultationService) { }

  ngOnInit(): void {
    this.loadConsultations();
  }

  loadConsultations(): void {
    this.consultationService.getAllConsultations().subscribe(
      (data: Consultation[]) => {
        this.consultations = data;
        this.sortConsultationsByDate(); // Trier les consultations après les avoir chargées
      },
      (error) => {
        console.error('Error fetching consultations', error);
      }
    );
  }

  selectConsultation(idConsultation: number): void {
    this.consultationService.getConsultationById(idConsultation).subscribe(
      (data: Consultation) => {
        this.selectedConsultation = data;
      },
      (error) => {
        console.error('Error fetching consultation details', error);
      }
    );
  }

   // Méthode pour trier les consultations par date
   sortConsultationsByDate(): void {
    this.consultations.sort((a, b) => {
      const dateA = new Date(a.consultation_date).getTime();
      const dateB = new Date(b.consultation_date).getTime();
      return this.sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    });
  }

  // Méthode pour changer la direction du tri
  toggleSortDirection(): void {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.sortConsultationsByDate(); // Re-trier les consultations
  }

}

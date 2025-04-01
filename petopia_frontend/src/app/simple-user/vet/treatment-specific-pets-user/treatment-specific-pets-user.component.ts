import { Component, OnInit } from '@angular/core';
import { DiagnosisService } from 'src/app/services/vet/diagnoses/diagnosis.service';
import { Diagnosis } from 'src/app/models/vet/diagnosis';
import { trigger, transition, style, animate } from '@angular/animations';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-treatment-specific-pets-user',
  templateUrl: './treatment-specific-pets-user.component.html',
  styleUrls: ['./treatment-specific-pets-user.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('fadeInGrow', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.8)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ]),
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class TreatmentSpecificPetsUserComponent implements OnInit {

  diagnoses: Diagnosis[] = [];
  filteredDiagnoses: Diagnosis[] = [];
  searchTerm: string = '';
  selectedType: string = 'all';
  petId: number | null = null;
  sortOrder: 'asc' | 'desc' = 'desc';
  qrCodeError = false;
  selectedDiagnosis: any;
  qrCodeUrl: string = "";
  petName: string = "";

  // Diagnosis types
  diagnosisTypes: string[] = ['all', 'Preventive', 'Maintenance', 'Emergency', 'Diagnostic'];

  constructor(
    private diagnosisService: DiagnosisService, 
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.petId = +params['id']; // Récupère l'ID du pet depuis l'URL
      this.loadDiagnoses();
    });
  }

  selectDiagnosis(id: number) {
    this.diagnosisService.getDiagnosisById(id).subscribe(
      (diagnosis) => {
        this.selectedDiagnosis = diagnosis;
        // Utilisez le bon endpoint avec le bon port (8082)
        this.qrCodeUrl = `http://localhost:8082/petopia/auth/Diagnosis/diagnosis/qrcode/${diagnosis.idDiagnosis}-QRCODE.png`;
        
        // Ajoutez un timestamp pour éviter le cache
        this.qrCodeUrl += '?t=' + new Date().getTime();
      },
      (error) => console.error('Error loading diagnosis:', error)
    );
  }

  loadDiagnoses(): void {
    if (this.petId) {
      this.diagnosisService.getDiagnosisByPetId(this.petId).subscribe(
        (data: Diagnosis[]) => {
          this.diagnoses = data;
          this.filteredDiagnoses = [...data];
          if (data.length > 0) {
            this.petName = data[0].petdiagnosis.petName;
          }
          this.sortByDate();
        },
        (error) => {
          console.error('Error fetching diagnoses', error);
        }
      );
    } else {
      this.diagnosisService.getAllDiagnosis().subscribe(
        (data: Diagnosis[]) => {
          this.diagnoses = data;
          this.filteredDiagnoses = [...data];
          this.sortByDate();
        },
        (error) => {
          console.error('Error fetching diagnoses', error);
        }
      );
    }
  }

  getBadgeColor(type: string): string {
    switch (type) {
      case 'Preventive': return '#F83182';
      case 'Maintenance': return '#FFA3B3';
      case 'Emergency': return '#f71100';
      case 'Diagnostic': return '#FF617C';
      default: return '#F83182';
    }
  }

  applyFilters(): void {
    this.filteredDiagnoses = this.diagnoses.filter(diagnosis => {
      const matchesType = this.selectedType === 'all' || diagnosis.diagnosisT === this.selectedType;
      return matchesType;
    });
    this.sortByDate();
  }

  toggleSortOrder(): void {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.sortByDate();
  }

  sortByDate(): void {
    this.filteredDiagnoses.sort((a, b) => {
      const dateA = new Date(a.diagnosis_date).getTime();
      const dateB = new Date(b.diagnosis_date).getTime();
      return this.sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
  }

}

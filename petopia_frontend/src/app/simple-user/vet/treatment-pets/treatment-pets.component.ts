import { Component, OnInit } from '@angular/core';
import { DiagnosisService } from 'src/app/services/vet/diagnoses/diagnosis.service';
import { Diagnosis } from 'src/app/models/vet/diagnosis';
import { trigger, transition, style, animate } from '@angular/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-treatment-pets',
  templateUrl: './treatment-pets.component.html',
  styleUrls: ['./treatment-pets.component.css'],
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
export class TreatmentPetsComponent implements OnInit {
  diagnoses: Diagnosis[] = [];
  filteredDiagnoses: Diagnosis[] = [];
  selectedDiagnosis: Diagnosis | null = null;
  searchTerm: string = '';
  selectedType: string = 'all';
  petId: number | null = null;
  sortOrder: 'asc' | 'desc' = 'desc';

  // Diagnosis types
  diagnosisTypes: string[] = ['all', 'Preventive', 'Maintenance', 'Emergency', 'Diagnostic'];

  constructor(private diagnosisService: DiagnosisService, private router: Router) { }

  ngOnInit(): void {
    this.loadDiagnoses();
  }

  loadDiagnoses(): void {
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

  navigateToDiagnosis() {
    if (this.petId) {
      this.router.navigate(['home/vet/treatment-pets', this.petId]);
    }
  }

  selectDiagnosis(idDiagnosis: number): void {
    this.diagnosisService.getDiagnosisById(idDiagnosis).subscribe(
      (data: Diagnosis) => {
        this.selectedDiagnosis = data;
      },
      (error) => {
        console.error('Error fetching diagnosis details', error);
      }
    );
  }

  getBadgeColor(type: string): string {
    switch (type) {
      case 'Preventive': return '#F83182';
      case 'Maintenance': return '#FFA3B3';
      case 'Emergency': return '#FE9A7A';
      case 'Diagnostic': return '#FF617C';
      default: return '#F83182';
    }
  }

  applyFilters(): void {
    this.filteredDiagnoses = this.diagnoses.filter(diagnosis => {
      const matchesSearch = diagnosis.petdiagnosis.petName.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesType = this.selectedType === 'all' || diagnosis.diagnosisT === this.selectedType;
      return matchesSearch && matchesType;
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
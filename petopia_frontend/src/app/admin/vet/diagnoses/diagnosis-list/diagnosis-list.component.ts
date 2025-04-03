import { Component, OnInit } from '@angular/core';
import { DiagnosisService } from 'src/app/services/vet/diagnoses/diagnosis.service';
import { Diagnosis } from 'src/app/models/vet/diagnosis';

@Component({
  selector: 'app-diagnosis-list',
  templateUrl: './diagnosis-list.component.html',
  styleUrls: ['./diagnosis-list.component.css']
})
export class DiagnosisListComponent implements OnInit{

  diagnoses: Diagnosis[] = [];
  selectedDiagnosis: Diagnosis | null = null;

  // var pagination
  p: number = 1; // Page actuelle
  itemsPerPage: number = 3; // Nombre d'éléments par page

  constructor(private diagnosisService: DiagnosisService) { }

  ngOnInit(): void {
    this.loadDiagnoses();
  }

  loadDiagnoses(): void {
    this.diagnosisService.getAllDiagnosis().subscribe(
      (data: Diagnosis[]) => {
        this.diagnoses = data;
      },
      (error) => {
        console.error('Error fetching diagnoses', error);
      }
    );
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

}

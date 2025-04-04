import { Component, OnInit } from '@angular/core';
import { DiagnosisService } from 'src/app/services/vet/diagnoses/diagnosis.service';
import { Diagnosis } from 'src/app/models/vet/diagnosis';
import { trigger, transition, style, animate } from '@angular/animations';
import { Router } from '@angular/router';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Medicament_Prescription } from 'src/app/models/vet/diagnosis';

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
  //selectedDiagnosis: Diagnosis | null = null;
  searchTerm: string = '';
  selectedType: string = 'all';
  petId: number | null = null;
  sortOrder: 'asc' | 'desc' = 'desc';
  qrCodeError = false;

  selectedDiagnosis: any;
  qrCodeUrl: string = "";

  // Diagnosis types
  diagnosisTypes: string[] = ['all', 'Preventive', 'Maintenance', 'Emergency', 'Diagnostic'];

  constructor(private diagnosisService: DiagnosisService, private router: Router) { }

  ngOnInit(): void {
    this.loadDiagnoses();
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
      this.router.navigate(['vet/treatment-specific-pet', this.petId]);
    }
  }
/*
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
    */

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

  //PDF generator function

  generatePDF() {
    const element = document.createElement('div');
    element.style.position = 'absolute';
    element.style.left = '-9999px';
    element.innerHTML = `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; color: #333;">
        <!-- En-tête avec logo -->
        <div style="display: flex; align-items: center; margin-bottom: 20px; border-bottom: 2px solid #F83182; padding-bottom: 15px;">
          <img src="assets/images/logo.png" style="height: 60px; margin-right: 15px;" alt="Petopia Logo">
          <div>
            <h1 style="color: #F83182; margin: 0; font-size: 24px;">Petopia Veterinary Prescription</h1>
            <p style="color: #FF617C; margin: 0; font-size: 14px;">Professional Animal Care</p>
          </div>
        </div>
        
        <!-- Titre du document -->
        <h2 style="color: #F83182; text-align: center; margin-bottom: 25px;">VETERINARY DIAGNOSIS & PRESCRIPTION</h2>
        
        <!-- Informations du diagnostic -->
        <div style="background-color: #FFF5F7; padding: 15px; border-radius: 10px; margin-bottom: 20px;">
          <h3 style="color: #FF617C; border-bottom: 1px dashed #FE9A7A; padding-bottom: 5px; margin-top: 0;">Diagnosis Details</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div>
              <p><strong>Diagnosis ID:</strong> ${this.selectedDiagnosis.idDiagnosis}</p>
              <p><strong>Date:</strong> ${new Date(this.selectedDiagnosis.diagnosis_date).toLocaleDateString()}</p>
            </div>
            <div>
              <p><strong>Type:</strong> <span style="color: ${this.getBadgeColor(this.selectedDiagnosis.diagnosisT)}; font-weight: bold;">${this.selectedDiagnosis.diagnosisT}</span></p>
            </div>
          </div>
          <p><strong>Description:</strong></p>
          <p style="background-color: white; padding: 10px; border-radius: 5px; border-left: 3px solid #F83182;">
            ${this.selectedDiagnosis.diagnosis_description}
          </p>
        </div>
        
        <!-- Informations sur l'animal -->
        <div style="background-color: #FFF5F7; padding: 15px; border-radius: 10px; margin-bottom: 20px;">
          <h3 style="color: #FF617C; border-bottom: 1px dashed #FE9A7A; padding-bottom: 5px; margin-top: 0;">Pet Information</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div>
              <p><strong>Name:</strong> ${this.selectedDiagnosis.petdiagnosis.petName}</p>
              <p><strong>Species:</strong> ${this.selectedDiagnosis.petdiagnosis.species}</p>
              <p><strong>Age:</strong> ${this.selectedDiagnosis.petdiagnosis.petAge} years</p>
            </div>
            <div>
              <p><strong>Breed:</strong> ${this.selectedDiagnosis.petdiagnosis.breed}</p>
              <p><strong>Gender:</strong> ${this.selectedDiagnosis.petdiagnosis.gender}</p>
              <p><strong>Health Status:</strong> ${this.selectedDiagnosis.petdiagnosis.healthStatus}</p>
            </div>
          </div>
        </div>
        
        <!-- Prescriptions -->
        <div style="background-color: #FFF5F7; padding: 15px; border-radius: 10px; margin-bottom: 20px;">
          <h3 style="color: #FF617C; border-bottom: 1px dashed #FE9A7A; padding-bottom: 5px; margin-top: 0;">Medication Prescriptions</h3>
          ${this.selectedDiagnosis.medicamentPrescriptions.length > 0 ? 
            '<ul style="list-style-type: none; padding-left: 5px;">' + 
            this.selectedDiagnosis.medicamentPrescriptions.map((p: Medicament_Prescription) => 
              `<li style="margin-bottom: 8px;">
                <span style="color: #F83182; font-weight: bold;">•</span> 
                <span style="font-weight: bold;">${p.medicament}</span>
              </li>`
            ).join('') + '</ul>' : 
            '<p style="font-style: italic;">No medications prescribed</p>'}
        </div>
        
        <!-- Signature -->
        <div style="margin-top: 40px; text-align: right;">
          <div style="border-top: 1px solid #F83182; display: inline-block; padding-top: 5px;">
            <p style="margin: 0; font-weight: bold; color: #FF617C;">Dr. Veterinarian Name</p>
            <p style="margin: 0; font-size: 12px;">Licensed Veterinarian</p>
            <p style="margin: 0; font-size: 12px;">Petopia Veterinary Clinic</p>
          </div>
        </div>
        
        <!-- Pied de page -->
        <div style="margin-top: 50px; font-size: 10px; text-align: center; color: #999; border-top: 1px solid #eee; padding-top: 10px;">
          <p>Generated by Petopia Veterinary System on ${new Date().toLocaleDateString()}</p>
        </div>
      </div>
    `;
    
    document.body.appendChild(element);
    
    html2canvas(element).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 190;
      const pageHeight = 280;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      let position = 10;
      
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`Petopia_Diagnosis_${this.selectedDiagnosis.idDiagnosis}_${this.selectedDiagnosis.petdiagnosis.petName}.pdf`);
      document.body.removeChild(element);
    });
  }

}
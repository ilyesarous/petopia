import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { DiagnosisService } from 'src/app/services/vet/diagnoses/diagnosis.service';
import { Diagnosis, Medicament_Prescription, Pet } from 'src/app/models/vet/diagnosis';

@Component({
  selector: 'app-treatment-specific-pets',
  templateUrl: './treatment-specific-pets.component.html',
  styleUrls: ['./treatment-specific-pets.component.css']
})
export class TreatmentSpecificPetsComponent implements OnInit {
  petId!: number;
  diagnoses: Diagnosis[] = [];
  isLoading: boolean = true;
  showAddForm: boolean = false;
  isEditing: boolean = false;
  currentDiagnosisId: number | null = null;

  diagnosisForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private diagnosisService: DiagnosisService,
    private fb: FormBuilder
  ) {
    this.diagnosisForm = this.fb.group({
      diagnosisT: ['', Validators.required],
      diagnosis_description: ['', Validators.required],
      diagnosis_date: ['', Validators.required],
      medicamentPrescriptions: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.petId = +this.route.snapshot.params['id'];
    this.loadDiagnoses();
  }

  get medicamentPrescriptions(): FormArray {
    return this.diagnosisForm.get('medicamentPrescriptions') as FormArray;
  }

  addMedicament(medicament: string = ''): void {
    this.medicamentPrescriptions.push(this.fb.group({
      medicament: [medicament, Validators.required]
    }));
  }

  removeMedicament(index: number): void {
    this.medicamentPrescriptions.removeAt(index);
  }

  loadDiagnoses(): void {
    this.isLoading = true;
    this.diagnosisService.getDiagnosisByPetId(this.petId).subscribe(
      (data) => {
        this.diagnoses = data;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching diagnoses:', error);
        this.isLoading = false;
      }
    );
  }

  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    this.isEditing = false;
    this.currentDiagnosisId = null;
    this.diagnosisForm.reset();
    this.medicamentPrescriptions.clear();
  }

  editDiagnosis(id: number): void {
    this.isEditing = true;
    this.showAddForm = true;
    this.currentDiagnosisId = id;
    
    const diagnosis = this.diagnoses.find(d => d.idDiagnosis === id);
    if (diagnosis) {
      this.diagnosisForm.patchValue({
        diagnosisT: diagnosis.diagnosisT,
        diagnosis_description: diagnosis.diagnosis_description,
        diagnosis_date: this.formatDateForInput(diagnosis.diagnosis_date)
      });
      
      // Clear existing medicaments
      this.medicamentPrescriptions.clear();
      
      // Add medicaments from diagnosis
      if (diagnosis.medicamentPrescriptions && diagnosis.medicamentPrescriptions.length > 0) {
        diagnosis.medicamentPrescriptions.forEach(med => {
          this.addMedicament(med.medicament);
        });
      }
    }
  }

  onSubmit(): void {
    if (this.diagnosisForm.invalid) {
      return;
    }

    const formData = this.diagnosisForm.value;
    const diagnosis: Diagnosis = {
      idDiagnosis: this.currentDiagnosisId || 0,
      diagnosisT: formData.diagnosisT,
      diagnosis_description: formData.diagnosis_description,
      diagnosis_date: formData.diagnosis_date,
      medicamentPrescriptions: formData.medicamentPrescriptions,
      petdiagnosis: { idPet: this.petId } as Pet
    };

    if (this.isEditing && this.currentDiagnosisId) {
      this.diagnosisService.updateDiagnosis(diagnosis).subscribe(
        () => {
          this.loadDiagnoses();
          this.toggleAddForm();
        },
        (error) => console.error('Error updating diagnosis:', error)
      );
    } else {
      this.diagnosisService.addDiagnosis(diagnosis).subscribe(
        () => {
          this.loadDiagnoses();
          this.toggleAddForm();
        },
        (error) => console.error('Error adding diagnosis:', error)
      );
    }
  }

  deleteDiagnosis(id: number): void {
    if (confirm('Are you sure you want to delete this diagnosis?')) {
      this.diagnosisService.deleteDiagnosis(id).subscribe(
        () => {
          this.loadDiagnoses();
        },
        (error) => console.error('Error deleting diagnosis:', error)
      );
    }
  }

  private formatDateForInput(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }
}
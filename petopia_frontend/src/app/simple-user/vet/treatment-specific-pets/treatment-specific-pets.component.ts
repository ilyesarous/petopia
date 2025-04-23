import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { DiagnosisService } from 'src/app/services/vet/diagnoses/diagnosis.service';
import { Diagnosis } from 'src/app/models/vet/diagnosis';
import { ActivatedRoute } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-treatment-specific-pets',
  templateUrl: './treatment-specific-pets.component.html',
  styleUrls: ['./treatment-specific-pets.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, height: 0 }),
        animate('200ms ease-out', style({ opacity: 1, height: '*' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, height: 0 }))
      ])
    ])
  ]
})
export class TreatmentSpecificPetsComponent implements OnInit {
  diagnoses: Diagnosis[] = [];
  diagnosisForm!: FormGroup;
  isEditing = false;
  isLoading = true;
  petId!: number;
  showForm = false;

  constructor(
    private diagnosisService: DiagnosisService,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.petId = +params['id'];
      this.loadDiagnoses();
    });
  }

  initForm(): void {
    this.diagnosisForm = this.fb.group({
      idDiagnosis: [null],
      diagnosis_description: ['', Validators.required],
      diagnosisT: ['', Validators.required],
      medicamentPrescriptions: this.fb.array([
        this.createMedicament()
      ]),
      petdiagnosis: this.fb.group({
        idPet: [this.petId, Validators.required]
      })
    });
  }

  createMedicament(medicamentValue: string = ''): FormGroup {
    return this.fb.group({
      medicament: [medicamentValue, Validators.required]
    });
  }

  get medicamentControls() {
    return (this.diagnosisForm.get('medicamentPrescriptions') as FormArray).controls;
  }

  addMedicament(): void {
    const medicaments = this.diagnosisForm.get('medicamentPrescriptions') as FormArray;
    medicaments.push(this.createMedicament());
  }

  removeMedicament(index: number): void {
    const medicaments = this.diagnosisForm.get('medicamentPrescriptions') as FormArray;
    medicaments.removeAt(index);
  }

  loadDiagnoses(): void {
    this.diagnosisService.getDiagnosisByPetId(this.petId).subscribe({
      next: (diagnoses) => {
        this.diagnoses = diagnoses;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading diagnoses:', err);
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.diagnosisForm.valid) {
      const formValue = this.diagnosisForm.value;
      
      const diagnosisData: any = {
        diagnosis_description: formValue.diagnosis_description,
        diagnosisT: formValue.diagnosisT,
        petdiagnosis: { idPet: formValue.petdiagnosis.idPet },
        medicamentPrescriptions: formValue.medicamentPrescriptions.map((m: any) => ({
          medicament: m.medicament
        }))
      };

      if (this.isEditing && formValue.idDiagnosis) {
        diagnosisData.idDiagnosis = formValue.idDiagnosis;
      }

      const operation = this.isEditing 
        ? this.diagnosisService.updateDiagnosis(diagnosisData)
        : this.diagnosisService.addDiagnosis(diagnosisData);

      operation.subscribe({
        next: () => {
          this.loadDiagnoses();
          this.resetForm();
          this.showForm = false;
        },
        error: (err) => {
          console.error('Error:', err);
        }
      });
    }
  }

  editDiagnosis(diagnosis: Diagnosis): void {
    this.isEditing = true;
    this.showForm = true;
    
    const medicaments = this.diagnosisForm.get('medicamentPrescriptions') as FormArray;
    medicaments.clear();

    this.diagnosisForm.patchValue({
      idDiagnosis: diagnosis.idDiagnosis,
      diagnosis_description: diagnosis.diagnosis_description,
      diagnosisT: diagnosis.diagnosisT,
      petdiagnosis: { idPet: diagnosis.petdiagnosis.idPet }
    });

    if (diagnosis.medicamentPrescriptions && diagnosis.medicamentPrescriptions.length > 0) {
      diagnosis.medicamentPrescriptions.forEach(med => {
        medicaments.push(this.createMedicament(med.medicament));
      });
    } else {
      this.addMedicament();
    }
  }

  deleteDiagnosis(id: number): void {
    if (confirm('Are you sure you want to delete this diagnosis?')) {
      this.diagnosisService.deleteDiagnosis(id).subscribe({
        next: () => this.loadDiagnoses(),
        error: (err) => console.error('Error deleting:', err)
      });
    }
  }

  resetForm(): void {
    this.diagnosisForm.reset({
      petdiagnosis: { idPet: this.petId }
    });
    
    const medicaments = this.diagnosisForm.get('medicamentPrescriptions') as FormArray;
    medicaments.clear();
    medicaments.push(this.createMedicament());
    
    this.isEditing = false;
    this.showForm = true;
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

  predefinedMedications: string[] = [
    'Gabrovet',
    'Zeleris',
    'OXYMED',
    'TYLOFORT 200',
    'VERIDIUM',
    'FENZOL',
    'DALBEN',
    'DOUVISTOME',
    'MELOXIDYL'
  ];

  getAvailableMedications(index: number): string[] {
    const selectedMedications = this.diagnosisForm.value.medicamentPrescriptions
      .map((m: any) => m.medicament)
      .filter((m: string | null, i: number) => m && i !== index);
    
    return this.predefinedMedications.filter(m => !selectedMedications.includes(m));
  }

}
import { Component, OnInit } from '@angular/core';
import { DiagnosisService } from 'src/app/services/vet/diagnoses/diagnosis.service';
import { Diagnosis } from 'src/app/models/vet/diagnosis';
import { trigger, transition, style, animate } from '@angular/animations';
import { ActivatedRoute } from '@angular/router';
import { PetGrowthsService } from 'src/app/services/vet/pet-growth/pet-growths.service';
import { PetGrowth } from 'src/app/models/vet/pet-growth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export type ChartOptions = {
  series: any[];
  chart: any;
  xaxis: any;
  yaxis: any;
  stroke: any;
  fill: any;
  tooltip: any;
  colors: string[];
};

export type BubbleChartOptions = {
  series: any[];
  chart: any;
  dataLabels: any;
  fill: any;
  xaxis: any;
  yaxis: any;
  tooltip: any;
  colors: string[];
};

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

  // Variables pour les graphiques de croissance
  petGrowths: PetGrowth[] = [];
  weightChartOptions: Partial<ChartOptions> | any;
  heightChartOptions: Partial<BubbleChartOptions> | any;
  private colorPalette = {
    pink: '#F83182',
    orange: '#FF617C',
    yellow: '#FE9A7A',
    pinkGradient: ['#F83182', '#FF617C'],
    orangeGradient: ['#FF617C', '#FE9A7A']
  };

  // Diagnosis types
  diagnosisTypes: string[] = ['all', 'Preventive', 'Maintenance', 'Emergency', 'Diagnostic'];

  constructor(
    private diagnosisService: DiagnosisService,
    private route: ActivatedRoute,
    private petGrowthService: PetGrowthsService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.petId = +params['id'];
      this.loadDiagnoses();
      this.loadPetGrowthData();
    });
  }

  selectDiagnosis(id: number) {
    this.diagnosisService.getDiagnosisById(id).subscribe(
      (diagnosis) => {
        this.selectedDiagnosis = diagnosis;
        // Utilisez le bon endpoint avec le bon port (8082)
        this.qrCodeUrl = `http://spring-service:7000/petopia/auth/Diagnosis/diagnosis/qrcode/${diagnosis.idDiagnosis}-QRCODE.png`;

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

  loadPetGrowthData() {
    if (this.petId) {
      this.petGrowthService.getPetGrowthsByPetId(this.petId).subscribe(
        (data: PetGrowth[]) => {
          this.petGrowths = data;
          if (data.length > 0) {
            this.initWeightChart();
            this.initHeightChart();
          }
        },
        (error) => {
          console.error('Error loading pet growth data:', error);
        }
      );
    }
  }

  private initWeightChart(): void {
    const dates = this.petGrowths.map(g =>
      new Date(g.measurement_date).toLocaleDateString()
    );
    const weights = this.petGrowths.map(g => g.weight);

    this.weightChartOptions = {
      series: [{
        name: 'Weight (kg)',
        data: weights
      }],
      chart: {
        type: 'area',
        height: 350,
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 2,
        colors: [this.colorPalette.pink]
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.3,
          stops: [0, 100],
          colorStops: [
            {
              offset: 0,
              color: this.colorPalette.pink,
              opacity: 1
            },
            {
              offset: 100,
              color: this.colorPalette.orange,
              opacity: 1
            }
          ]
        }
      },
      colors: [this.colorPalette.pink],
      xaxis: {
        categories: dates,
        title: {
          text: 'Date'
        }
      },
      yaxis: {
        title: {
          text: 'Weight (kg)'
        }
      },
      tooltip: {
        y: {
          formatter: (val: number) => `${val} kg`
        },
        style: {
          background: this.colorPalette.pink,
          color: '#fff'
        }
      }
    };
  }

  private initHeightChart(): void {
    const heightData = this.petGrowths.map(g => ({
      x: new Date(g.measurement_date).getTime(),
      y: g.height,
      z: 20
    }));

    this.heightChartOptions = {
      series: [{
        name: 'Height (cm)',
        data: heightData
      }],
      chart: {
        type: 'bubble',
        height: 350,
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      fill: {
        opacity: 0.8,
        colors: [this.colorPalette.orange]
      },
      colors: [this.colorPalette.orange],
      xaxis: {
        type: 'datetime',
        title: {
          text: 'Date'
        },
        labels: {
          formatter: (value: string) => new Date(value).toLocaleDateString()
        }
      },
      yaxis: {
        title: {
          text: 'Height (cm)'
        }
      },
      tooltip: {
        custom: ({ seriesIndex, dataPointIndex, w }: any) => {
          const data = w.globals.initialSeries[seriesIndex].data[dataPointIndex];
          const date = new Date(data.x).toLocaleDateString();
          return `
            <div class="apexcharts-tooltip-custom"
                 style="background: ${this.colorPalette.yellow}; color: #fff; padding: 5px 10px; border-radius: 5px;">
              <span>Date: ${date}</span><br/>
              <span>Height: ${data.y} cm</span>
            </div>`;
        }
      },
      markers: {
        colors: [this.colorPalette.yellow]
      }
    };
  }

}

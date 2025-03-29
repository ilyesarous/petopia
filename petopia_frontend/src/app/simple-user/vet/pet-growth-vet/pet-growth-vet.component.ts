import { Component, OnInit } from '@angular/core';
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
  selector: 'app-pet-growth-vet',
  templateUrl: './pet-growth-vet.component.html',
  styleUrls: ['./pet-growth-vet.component.css']
})
export class PetGrowthVetComponent implements OnInit {
  petId!: number;
  petGrowths: PetGrowth[] = [];
  petDetails: any = {};
  isLoading: boolean = true;
  showAddForm: boolean = false;
  isEditing: boolean = false;
  currentGrowthId: number | null = null;
  
  growthForm: FormGroup;

  // Configuration des graphiques
  public weightChartOptions: Partial<ChartOptions> | any;
  public heightChartOptions: Partial<BubbleChartOptions> | any;

  // Couleurs personnalisées
  private colorPalette = {
    pink: '#F83182',
    orange: '#FF617C',
    yellow: '#FE9A7A',
    pinkGradient: ['#F83182', '#FF617C'],
    orangeGradient: ['#FF617C', '#FE9A7A']
  };

  constructor(
    private route: ActivatedRoute,
    private petGrowthService: PetGrowthsService,
    private fb: FormBuilder
  ) {
    this.growthForm = this.fb.group({
      weight: ['', [Validators.required, Validators.min(0)]],
      height: ['', [Validators.required, Validators.min(0)]],
      health_status: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.petId = +this.route.snapshot.params['id'];
    this.loadPetData();
  }

  loadPetData() {
    this.petGrowthService.getPetGrowthsByPetId(this.petId).subscribe(
      (data: PetGrowth[]) => {
        this.petGrowths = data;
        if (data.length > 0) {
          this.petDetails = {
            idPet: data[0].petgrowth.idPet,
            petName: data[0].petgrowth.petName,
            breed: data[0].petgrowth.breed,
            petAge: data[0].petgrowth.petAge,
            petImage: data[0].petgrowth.petImage,
            gender: data[0].petgrowth.gender,
            healthStatus: data[0].health_status,
          };
          
          this.initWeightChart();
          this.initHeightChart();
        }
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading pet growth data:', error);
        this.isLoading = false;
      }
    );
  }

  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
    if (!this.showAddForm) {
      this.isEditing = false;
      this.currentGrowthId = null;
      this.growthForm.reset();
    }
  }

  prepareEditForm(growth: PetGrowth) {
    this.isEditing = true;
    this.currentGrowthId = growth.idPet_Growth;
    this.showAddForm = true;
    this.growthForm.patchValue({
      weight: growth.weight,
      height: growth.height,
      health_status: growth.health_status
    });
  }

  onSubmit() {
    if (this.growthForm.invalid) return;

    const growthData = {
      ...this.growthForm.value,
      petgrowth: { idPet: this.petId }
    };

    if (this.isEditing && this.currentGrowthId) {
      // Mise à jour existante
      this.petGrowthService.updatePetGrowth(this.currentGrowthId, growthData).subscribe({
        next: () => {
          this.loadPetData();
          this.toggleAddForm();
        },
        error: (err) => console.error('Error updating growth:', err)
      });
    } else {
      // Création nouvelle entrée
      this.petGrowthService.addPetGrowth(growthData).subscribe({
        next: () => {
          this.loadPetData();
          this.toggleAddForm();
        },
        error: (err) => console.error('Error adding growth:', err)
      });
    }
  }

  deleteGrowth(id: number) {
    if (confirm('Are you sure you want to delete this growth record?')) {
      this.petGrowthService.deletePetGrowth(id).subscribe({
        next: () => this.loadPetData(),
        error: (err) => console.error('Error deleting growth:', err)
      });
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
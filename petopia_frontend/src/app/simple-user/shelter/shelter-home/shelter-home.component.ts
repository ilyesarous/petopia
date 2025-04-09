import { Component, OnInit } from '@angular/core';
import { Adoption } from 'src/app/models/adoption/adoption/Adoption';
import { Shelter } from 'src/app/models/adoption/shelter/Shelter';
import { AdoptionService } from 'src/app/services/adoptions/adoption/adoption.service';
import { ShelterService } from 'src/app/services/adoptions/shelter/shelter.service';
import { PetService } from 'src/app/services/pets/pet.service';
import {
  ApexNonAxisChartSeries,
  ApexChart,
  ApexResponsive,
  ApexAxisChartSeries,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexYAxis,
  ApexLegend
} from 'ng-apexcharts';
import { Router } from '@angular/router';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  title: ApexTitleSubtitle;
  legend?: ApexLegend;
  dataLabels?: ApexDataLabels;
  colors?: string[];
};

export type ColumnChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis?: ApexYAxis;
  dataLabels?: ApexDataLabels;
  title: ApexTitleSubtitle;
  plotOptions?: any;
  colors?: string[];
};

@Component({
  selector: 'app-shelter-home',
  templateUrl: './shelter-home.component.html',
  styleUrls: ['./shelter-home.component.css']
})
export class ShelterHomeComponent implements OnInit {
  shelter?: Shelter;
  totalPets = 0;
  availablePets = 0;
  adoptedPets = 0;
  pendingRequests = 0;
  recentPendingRequests: Adoption[] = [];

  mostAdoptedSpecies: string = '';
  breedChartOptions!: Partial<ChartOptions>;
  requesterChartOptions!: Partial<ColumnChartOptions>;
  averageAge: number = 0;

  constructor(
    private shelterService: ShelterService,
    private petService: PetService,
    private adoptionService: AdoptionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userIdStr = localStorage.getItem('userId');
    if (!userIdStr) return;

    const userId = Number(userIdStr);
    this.shelterService.getShelterByUserId(userId).subscribe({
      next: (shelterData) => {
        this.shelter = shelterData;

        if (this.shelter.id_shelter) {
          this.loadPetStats(this.shelter.id_shelter);
          this.loadAdoptionStats(this.shelter.id_shelter);
        }
      },
      error: (err) => console.error('Error fetching shelter', err)
    });
  }

  private loadPetStats(shelterId: number) {
    this.petService.getPetsByShelterId(shelterId).subscribe(pets => {
      this.totalPets = pets.length;
      this.availablePets = pets.filter(p => p.status === 'AVAILABLE').length;
      this.adoptedPets = pets.filter(p => p.status === 'ADOPTED').length;
    });
  }

  private loadAdoptionStats(shelterId: number) {
    this.adoptionService.getAdoptionsByShelterId(shelterId).subscribe(reqs => {
      const adopted = reqs.filter(r => r.status === 'APPROVED');
      this.pendingRequests = reqs.filter(r => r.status === 'PENDING').length;
      this.recentPendingRequests = reqs.filter(r => r.status === 'PENDING').slice(0, 2);

      // Most Adopted Species
      const speciesCount: { [key: string]: number } = {};
      adopted.forEach(r => {
        const species = r.pet.species;
        speciesCount[species] = (speciesCount[species] || 0) + 1;
      });
      this.mostAdoptedSpecies = Object.entries(speciesCount).sort((a, b) => b[1] - a[1])[0]?.[0] || '';

      // Breed Chart (Pie)
      const breedCount: { [key: string]: number } = {};
      adopted.forEach(r => {
        const breed = r.pet.breed;
        breedCount[breed] = (breedCount[breed] || 0) + 1;
      });

      this.breedChartOptions = {
        chart: {
          type: 'pie',
          height: 300
        },
        labels: Object.keys(breedCount),
        series: Object.values(breedCount),
        title: {
          text: 'Most Adopted Breeds',
          align: 'center'
        },
        colors: ['#F83182', '#FF617C', '#FE9A7A','#ff7439'],
        dataLabels: {
          enabled: true,
          formatter: (val: number) => `${val.toFixed(1)}%`
        },
        legend: {
          position: 'right'
        }
      };

      // Average Pet Age
      const totalAge = adopted.reduce((sum, r) => sum + r.pet.petAge, 0);
      this.averageAge = adopted.length ? Math.round(totalAge / adopted.length) : 0;

      // Requester Chart (Bar)
      const requesterCount: { [key: string]: number } = {};
      adopted.forEach(r => {
        const name = r.requester.name;
        requesterCount[name] = (requesterCount[name] || 0) + 1;
      });

      this.requesterChartOptions = {
        series: [{
          name: 'Requests',
          data: Object.values(requesterCount)
        }],
        chart: {
          type: 'bar',
          height: 300
        },
        xaxis: {
          categories: Object.keys(requesterCount)
        },
        title: {
          text: 'Top Requesters'
        },
        plotOptions: {
          bar: {
            distributed: true,
            borderRadius: 4,
            columnWidth: '55%'
          }
        },
        dataLabels: {
          enabled: true
        },
        colors: ['#F83182'],
      };
    });
  }
  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
  
}

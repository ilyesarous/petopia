import { Component, OnInit } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import {ReclamationService} from "../../services/user/reclamation.service";

// Register Chart.js components
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard-component',
  templateUrl: './dashboard-component.component.html',
  styleUrls: ['./dashboard-component.component.css']
})
export class DashboardComponentComponent implements OnInit {
  public chartLabels: string[] = [];
  public chartDatasets: ChartConfiguration<'bar'>['data']['datasets'] = [
    {
      data: [],
      label: 'Reclamations',
      backgroundColor: '#3b82f6',
      borderColor: '#1d4ed8',
      borderWidth: 1
    }
  ];
  public chartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 }
      }
    },
    plugins: {
      legend: { display: true, position: 'top' }
    }
  };
  loading: boolean = true;
  errorMessage: string = '';

  constructor(private reclamationService: ReclamationService) {}

  ngOnInit(): void {
    this.reclamationService.getStats().subscribe({
      next: (data: { [key: string]: number }) => {
        this.chartLabels = Object.keys(data);
        this.chartDatasets[0].data = Object.values(data);
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement des statistiques.';
        console.error(error);
        this.loading = false;
      }
    });
  }
}

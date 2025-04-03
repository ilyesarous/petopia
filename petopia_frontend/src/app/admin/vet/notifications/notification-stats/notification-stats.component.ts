import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-notification-stats',
  templateUrl: './notification-stats.component.html',
  styleUrls: ['./notification-stats.component.css']
})
export class NotificationStatsComponent implements OnInit, OnChanges {
  @Input() seenCount: number = 0; // Nombre de notifications vues
  @Input() unseenCount: number = 0; // Nombre de notifications non vues

  public chart: any;

  constructor() {
    Chart.register(...registerables); // Enregistrer les modules de Chart.js
  }

  ngOnInit(): void {
    this.createChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.chart) {
      // Mettre à jour les données
      this.chart.data.datasets[0].data = [this.seenCount, this.unseenCount];
  
      // Mettre à jour les labels
      this.chart.data.labels = [
        `Seen (${this.seenCount})`,
        `Unseen (${this.unseenCount})`
      ];
  
      // Mettre à jour le graphique
      this.chart.update();
    }
  }

  createChart(): void {
    if (this.chart) {
      this.chart.destroy(); // Détruire le graphique existant s'il y en a un
    }

    this.chart = new Chart('notificationChart', {
      type: 'pie',
      data: {
        labels: [
          `Seen (${this.seenCount})`, 
          `Unseen (${this.unseenCount})`],
        datasets: [{
          data: [this.seenCount, this.unseenCount],
          backgroundColor: ['#FF617C', '#FE9A7A'],
          hoverBackgroundColor: ['#F83182', '#F89880'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#333'
            }
          },
          title: {
            display: true,
            text: 'Notification Statistics',
            color: '#F83182',
            font: {
              size: 16
            }
          }
        }
      }
    });
  }
}
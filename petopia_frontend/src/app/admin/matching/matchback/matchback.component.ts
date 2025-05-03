import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// Custom type to match ng-apexcharts expectations
export type ChartOptions = {
  series: any;
  chart: any;
  xaxis?: any;
  yaxis?: any;
  plotOptions?: any;
  dataLabels?: any;
  colors?: string[];
  title?: any;
  labels?: string[];
  responsive?: any;
};

interface Statistics {
  breedStatistics: { [key: string]: number };
  speciesStatistics: { [key: string]: number };
  ageGroupStatistics: { [key: string]: number };
}

@Component({
  selector: 'app-matchback',
  templateUrl: './matchback.component.html',
  styleUrls: ['./matchback.component.css']
})
export class MatchbackComponent implements OnInit {
  public loading = true;
  public error: string | null = null;

  public breedChartOptions: Partial<ChartOptions> = {
    series: [],
    chart: {
      type: 'bar',
      height: 400,
      fontFamily: 'Poppins, sans-serif',
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false
        }
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 5
      }
    },
    dataLabels: {
      enabled: true
    },
    xaxis: {
      categories: [],
      title: { text: 'Breed' }
    },
    yaxis: {
      title: { text: 'Number of Matches' },
      min: 0
    },
    colors: ['#FF617C'], // Orange
    title: {
      text: 'Matches by Breed',
      align: 'center',
      style: { fontSize: '18px', color: '#F472B6' } // Lighter Rose (rose-500)
    }
  };

  public speciesChartOptions: Partial<ChartOptions> = {
    series: [],
    chart: {
      type: 'pie',
      height: 400,
      fontFamily: 'Poppins, sans-serif',
      toolbar: {
        show: true,
        tools: {
          download: true, // Enable download menu
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false
        }
      }
    },
    labels: [],
    colors: ['#F83182', '#FF617C', '#FE9A7A'], // Rose, Orange, Yellow
    title: {
      text: 'Matches by Species',
      align: 'center',
      style: { fontSize: '18px', color: '#FE9A7A' } // Yellow
    },
    responsive: [{
      breakpoint: 480,
      options: { chart: { width: 300 }, legend: { position: 'bottom' } }
    }],
    dataLabels: {
      enabled: true
    }
  };

  public ageChartOptions: Partial<ChartOptions> = {
    series: [],
    chart: {
      type: 'bar',
      height: 400,
      fontFamily: 'Poppins, sans-serif',
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false
        }
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 5
      }
    },
    dataLabels: {
      enabled: true
    },
    xaxis: {
      categories: [],
      title: { text: 'Age Group' }
    },
    yaxis: {
      title: { text: 'Number of Matches' },
      min: 0
    },
    colors: ['#F83182', '#FF617C', '#FE9A7A'], // Yellow
    title: {
      text: 'Matches by Age Group',
      align: 'center',
      style: { fontSize: '18px', color: '#FF617C' } // Orange
    }
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchStatistics();
  }

  private fetchStatistics(): void {
    this.http.get<Statistics>('http://localhost:8082/petopia/admin/stats/matches').subscribe({
      next: (data) => {
        // Update breed chart
        this.breedChartOptions = {
          ...this.breedChartOptions,
          series: [{ name: 'Matches', data: Object.values(data.breedStatistics) }],
          xaxis: { ...this.breedChartOptions.xaxis, categories: Object.keys(data.breedStatistics) }
        };

        // Update species chart
        this.speciesChartOptions = {
          ...this.speciesChartOptions,
          series: Object.values(data.speciesStatistics),
          labels: Object.keys(data.speciesStatistics)
        };

        // Update age chart
        this.ageChartOptions = {
          ...this.ageChartOptions,
          series: [{ name: 'Matches', data: Object.values(data.ageGroupStatistics) }],
          xaxis: { ...this.ageChartOptions.xaxis, categories: Object.keys(data.ageGroupStatistics) }
        };

        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load statistics. Please try again later.';
        this.loading = false;
        console.error('Error fetching statistics:', err);
      }
    });
  }
}
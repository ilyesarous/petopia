import { Component, OnInit, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexGrid,
  ApexLegend,
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexResponsive,
  ApexStroke,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
  ChartComponent,
} from 'ng-apexcharts';
import { Product } from 'src/app/models/product/Product';
import { FeedbackService } from 'src/app/services/store/feedback/feedback.service';
import { DashboardService } from 'src/app/services/store/partner/dashboard.service';
import { ProductService } from 'src/app/services/store/products/product.service';
import { AuthService } from 'src/app/services/user/auth.service';

interface stats {
  totalProducts: number;
  averageRating: number;
  totalSales: number;
  totalRevenue: number;
  topSellingProducts: Product[];
  topSellingProductIds: number[];
  listTotalByProduct: number[];
  sentiment: string[];
}
export type ChartOptions = {
  series: ApexAxisChartSeries | ApexNonAxisChartSeries;
  chart: ApexChart;
  dataLabels?: ApexDataLabels;
  plotOptions?: ApexPlotOptions;
  responsive?: ApexResponsive[];
  xaxis?: ApexXAxis;
  yaxis?: ApexYAxis;
  legend?: ApexLegend;
  labels?: string[];
  colors?: string[];
  grid?: ApexGrid;
  tooltip?: ApexTooltip;
  stroke?: ApexStroke;
  fill?: ApexFill;
};

@Component({
  selector: 'app-home-partner',
  templateUrl: './home-partner.component.html',
  styleUrls: ['./home-partner.component.css'],
})
export class HomePartnerComponent implements OnInit {
  @ViewChild('chart') chart!: ChartComponent;
  username: string = "";
  public summaryChartOptions: ChartOptions = {
    series: [],
    chart: {
      type: 'bar',
      height: 350,
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 4, // Rounded corners
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: [],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: { colors: '#666', fontSize: '12px' },
      },
    },
    yaxis: {
      labels: {
        style: { colors: '#666', fontSize: '12px' },
      },
    },
    grid: {
      borderColor: '#f0f0f0',
      strokeDashArray: 3,
    },
    colors: ['#e88a6a', '#e6516c'],
    tooltip: {
      enabled: true,
      style: { fontSize: '12px' },
    },
  };

    public topProductsChartOptions: ChartOptions = {
      series: [],
      chart: {
        type: 'bar',
        height: 350,
        toolbar: { show: false },
      },
      plotOptions: {
        bar: {
          horizontal: true,
          borderRadius: 4,
          dataLabels: { position: 'top' },
        },
      },
      dataLabels: {
        enabled: true,
        style: { colors: ['#fff'] },
      },
      xaxis: {
        categories: [],
        position: 'top',
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: {
          style: { colors: '#666', fontSize: '12px' },
        },
      },
      yaxis: {
        labels: {
          style: { colors: '#666', fontSize: '12px' },
        },
      },
      grid: {
        borderColor: '#f0f0f0',
        strokeDashArray: 3,
      },
      colors: ['#d82172'],
      tooltip: {
        enabled: true,
        style: { fontSize: '12px' },
      },
    };

  public ratingChartOptions: ChartOptions = {
    series: [0],
    chart: {
      type: 'radialBar',
      height: 350,
      toolbar: { show: false },
    },
    plotOptions: {
      radialBar: {
        hollow: { size: '70%' },
        track: { background: '#f0f0f0' },
        dataLabels: {
          name: { fontSize: '16px', color: '#666' },
          value: { fontSize: '22px', color: '#333', fontWeight: 'bold' },
        },
      },
    },
    labels: [''],
    colors: ['#e6516c'],
    stroke: { lineCap: 'round' },
  };

  loading = true;
  error: string | null = null;

  listProducts: Product[] = [];
  searchQuery: string = '';
  recentSearches: string[] = [];
  filteredProducts: Product[] = [];

  categoryFilter = '';
  categories = ['ACCESSORY', 'FOOD', 'TOY', 'GROOMING'];
  showAddProductModal = false;
  role: string = ""
  idUser = 0;
  //added
  currentProduct: Product | null = null;
  isEditMode: boolean = false;
  constructor(
    private productService: ProductService,
    private dashboardService: DashboardService,
    private feedbackService: FeedbackService,
    private authService : AuthService
  ) {
    Chart.register(...registerables);
  }

  partnerName = 'John Doe'; // Replace with actual partner name
  stats: stats = {
    totalProducts: 0,
    averageRating: 0,
    totalSales: 0,
    totalRevenue: 0,
    topSellingProducts: [],
    topSellingProductIds: [],
    listTotalByProduct: [],
    sentiment: [],
  };

  ngOnInit(): void {
    this.idUser = localStorage.getItem('userId')
      ? parseInt(localStorage.getItem('userId')!)
      : 0;
      this.authService.role.subscribe((role) => {
        this.role = role || ''; // Ensure role is never undefined
      });
    this.getAllProducts();
    this.loadRecentSearches();
    this.loadDashboardData();
    this.partnerName = localStorage.getItem('username') || 'John Doe';
  }
  onSearch() {
    if (!this.searchQuery.trim()) {
      this.filteredProducts = [...this.listProducts];
      return;
    }

    this.filterProducts(this.searchQuery);
    this.addToRecentSearches(this.searchQuery);
  }

  // In your component class
  getStarFill(star: number): string {
    const rating = this.stats.averageRating || 0;
    if (star <= rating) return 'filled';
    if (star < rating) return 'partial';
    return '';
  }

  filterProducts(query: string) {
    const lowerQuery = query.toLowerCase();
    this.filteredProducts = this.listProducts.filter(
      (product) =>
        product.product_name.toLowerCase().includes(lowerQuery) ||
        product.category.toLowerCase().includes(lowerQuery) ||
        (product.product_description &&
          product.product_description.toLowerCase().includes(lowerQuery))
    );
  }

  addToRecentSearches(term: string) {
    term = term.trim();
    if (!term) return;

    this.recentSearches = this.recentSearches.filter((t) => t !== term);
    this.recentSearches.unshift(term);
    this.recentSearches = this.recentSearches.slice(0, 5);
    localStorage.setItem('recentSearches', JSON.stringify(this.recentSearches));
  }

  loadDashboardData(): void {
    this.dashboardService.getDashboardData(this.idUser).subscribe({
      next: (data) => {
        this.stats.averageRating = parseFloat(data.averageRating.toFixed(1));
        this.stats.totalSales = data.totalSales;
        this.stats.totalRevenue = data.totalRevenue;
        this.stats.topSellingProducts = data.topSellingProducts.slice(0,3);
        this.stats.topSellingProductIds = data.topSellingProducts.map(
          (p: any) => p.product_id
        );
        this.stats.listTotalByProduct = data.listTotalByProduct;
        this.initCharts();
        this.loading = false;
      },
      error: (err) => this.handleError(err),
    });
    this.loading = true;
    this.error = null;
  }

  loadRecentSearches() {
    const saved = localStorage.getItem('recentSearches');
    this.recentSearches = saved ? JSON.parse(saved) : [];
  }

  applySearch(term: string) {
    this.searchQuery = term;
    this.onSearch();
  }

  initCharts(): void {
    // Summary Chart (Revenue vs Sales)
    this.summaryChartOptions = {
      series: [
        {
          name: 'Revenue',
          data: [this.stats.totalRevenue || 0],
          color: '#e88a6a',
        },
        {
          name: 'Sales',
          data: [this.stats.totalSales || 0],
          color: '#e6516c',
        },
      ],
      chart: {
        type: 'bar',
        height: 350,
        stacked: false,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '45%',
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: ['Performance Metrics'],
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          style: {
            colors: '#666',
            fontSize: '12px',
          },
        },
      },
      yaxis: {
        title: {
          text: 'Amount',
          style: {
            color: '#666',
            fontSize: '12px',
          },
        },
        labels: {
          formatter: (value: number) => `$${value.toLocaleString()}`,
          style: {
            colors: '#666',
          },
        },
        axisBorder: {
          show: true,
          color: '#f0f0f0',
        },
      },
      grid: {
        borderColor: '#f0f0f0',
        strokeDashArray: 3,
      },
      tooltip: {
        y: {
          formatter: (value: number) => `$${value.toLocaleString()}`,
        },
      },
    };

    // Top Products Chart
    this.topProductsChartOptions = {
      series: [
        {
          name: 'Revenue',
          data: this.stats.listTotalByProduct?.slice(0, 3) || [],
          color: '#d82172',
        },
      ],
      chart: {
        type: 'bar',
        height: 350,
      },
      plotOptions: {
        bar: {
          horizontal: true,
          borderRadius: 4,
          dataLabels: {
            position: 'top',
          },
        },
      },
      dataLabels: {
        enabled: true,
        formatter: (val: number) => `$${val.toLocaleString()}`,
        offsetX: 0,
        style: {
          fontSize: '12px',
          colors: ['#fff'],
        },
      },
      xaxis: {
        categories:
          this.stats.topSellingProducts
            ?.slice(0, 5)
            .map((p) => p.product_name) || [],
        position: 'top',
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          show: true,
          style: {
            colors: '#666',
            fontSize: '12px',
          },
          formatter: (value: string) =>
            value.length > 15 ? `${value.substring(0, 15)}...` : value,
        },
        title: {
          text: 'Revenue',
          offsetY: -10,
          style: {
            color: '#666',
            fontSize: '12px',
          },
        },
      },
      yaxis: {
        labels: {
          show: true,
          style: {
            colors: '#666',
            fontSize: '12px',
          },
        },
        axisBorder: {
          show: true,
          color: '#f0f0f0',
        },
      },
      grid: {
        borderColor: '#f0f0f0',
        strokeDashArray: 3,
      },
      tooltip: {
        y: {
          formatter: (val: number) => `$${val.toLocaleString()}`,
        },
      },
    };

    // Rating Chart
    this.ratingChartOptions = {
      series: [this.stats.averageRating ? this.stats.averageRating * 20 : 0],
      chart: {
        type: 'radialBar',
        height: 350,
      },
      colors: ['#e6516c'],
      plotOptions: {
        radialBar: {
          startAngle: -135,
          endAngle: 135,
          hollow: {
            margin: 0,
            size: '70%',
          },
          dataLabels: {
            name: {
              offsetY: -10,
              color: '#666',
              fontSize: '13px',
            },
            value: {
              color: '#333',
              fontSize: '30px',
              fontWeight: 'bold',
              show: true,
              formatter: (val: number) => (val / 20).toFixed(1),
            },
          },
          track: {
            background: '#f0f0f0',
            strokeWidth: '97%',
            margin: 5,
          },
        },
      },
      labels: ['Average Rating'],
      stroke: {
        lineCap: 'round',
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              height: 300,
            },
          },
        },
      ],
    };
  }
  getRankColor(index: number): string {
    const colors = ['#e88a6a', '#e6516c', '#d82172'];
    return colors[index] || '#d82172';
  }

  getRatingClass(): string {
    if (this.stats.averageRating >= 4) return 'positive';
    if (this.stats.averageRating >= 3) return 'neutral';
    return 'negative';
  }

  getRatingIcon(): string {
    if (this.stats.averageRating >= 4) return 'bi bi-emoji-smile';
    if (this.stats.averageRating >= 3) return 'bi bi-emoji-neutral';
    return 'bi bi-emoji-frown';
  }

  getRatingMessage(): string {
    if (this.stats.averageRating >= 4)
      return 'Excellent customer satisfaction!';
    if (this.stats.averageRating >= 3) return 'Good, but could improve';
    return 'Needs improvement';
  }

  isTopSelling(product: Product): boolean {
    return this.stats.topSellingProductIds.includes(product.product_id);
  }

  removeRecentSearch(term: string, event: Event) {
    event.stopPropagation();
    this.recentSearches = this.recentSearches.filter((t) => t !== term);
    localStorage.setItem('recentSearches', JSON.stringify(this.recentSearches));
    this.searchQuery = '';
    this.filteredProducts = [...this.listProducts];
  }

  clearSearch() {
    this.searchQuery = '';
    this.filteredProducts = [...this.listProducts];
  }

  getAllProducts() {
    const idUser = localStorage.getItem('userId')
      ? parseInt(localStorage.getItem('userId')!)
      : 0;
    this.productService.getProductByPartnerId(idUser).subscribe((response) => {
      this.listProducts = response;
      this.filteredProducts = [...this.listProducts];
      this.filteredProducts.map(product => this.getSentiment(product.product_id))
      this.stats.totalProducts = this.listProducts.length;
    });
  }

  getSentimentIcon(sentiment: string): string {
    switch(sentiment) {
      case 'positive': return '../../../../assets/images/store/product/positive.png';
      case 'negative': return '../../../../assets/images/store/product/negative.png';
      default: return '../../../../assets/images/store/product/neutral.png';
    }
  }

  private handleError(error: any): void {
    this.loading = false;
    this.error = 'Failed to load dashboard data. Please try again later.';
    console.error('Dashboard error:', error);
  }

  closeModal(): void {
    this.showAddProductModal = false;
  }
  // Update your openAddProductModal method
  editProduct(product: Product): void {
    this.currentProduct = product;
    this.isEditMode = true;
    this.showAddProductModal = true;
  }

  openAddProductModal(): void {
    this.currentProduct = null;
    this.isEditMode = false;
    this.showAddProductModal = true;
  }

  // Update your handleProductAdded method to handle both add and edit
  handleProductAdded(updatedProduct: Product): void {
    if (this.isEditMode) {
      // Update existing product in the list
      const index = this.listProducts.findIndex(
        (p) => p.product_id === updatedProduct.product_id
      );
      if (index !== -1) {
        this.listProducts[index] = updatedProduct;
        this.filteredProducts = [...this.listProducts];
      }
    } else {
      // Add new product
      this.listProducts.unshift(updatedProduct);
      this.filteredProducts.unshift(updatedProduct);
      this.stats.totalProducts++;
    }
    this.closeModal();
  }

  confirmDelete(productId: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProductPartner(productId).subscribe({
        next: () => {
          this.listProducts = this.listProducts.filter(
            (product) => product.product_id !== productId
          );
          this.filteredProducts = [...this.listProducts];
          this.stats.totalProducts--;
        },
        error: (err) => console.error('Failed to delete product', err),
      });
    }
  }

  getSentiment(id: number): void {
    this.feedbackService.getSentimentByProduct(id).subscribe((res) => {
      const product = this.listProducts.find((p) => p.product_id === id);
      if (product) {
        product.sentiment = res;
      }
    });
  }

  applyFilters(): void {
    this.filteredProducts = this.listProducts.filter((product) => {
      const matchesSearch = product.product_name
        .toLowerCase()
        .includes(this.searchQuery.toLowerCase());
      const matchesCategory = this.categoryFilter
        ? product.category === this.categoryFilter
        : true;
      return matchesSearch && matchesCategory;
    });
  }
}

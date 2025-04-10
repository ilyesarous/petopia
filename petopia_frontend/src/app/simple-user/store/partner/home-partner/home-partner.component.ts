import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { Product } from 'src/app/models/product/Product';
import { DashboardService } from 'src/app/services/store/partner/dashboard.service';
import { ProductService } from 'src/app/services/store/products/product.service';

@Component({
  selector: 'app-home-partner',
  templateUrl: './home-partner.component.html',
  styleUrls: ['./home-partner.component.css'],
})
export class HomePartnerComponent implements OnInit {
  @ViewChild('salesChart') salesChartRef!: ElementRef;
  @ViewChild('productsChart') productsChartRef!: ElementRef;
  listProducts: Product[] = [];
  searchQuery: string = '';
  recentSearches: string[] = [];
  filteredProducts: Product[] = [];
  nameList: string[] = [];
  quntityList: number[] = [];
  categoryFilter = '';
  categories = ['ACCESSORY', 'FOOD', 'TOY', 'GROOMING'];
  showAddProductModal = false;
  idUser = 0;
  constructor(private productService: ProductService, private dashboardService: DashboardService) {
    Chart.register(...registerables);
  }

  partnerName = 'John Doe'; // Replace with actual partner name
  stats = {
    totalProducts: 24,
    averageRating: 56,
    totalSales: 120,
    totalRevenue: 78,
    topSellingProducts: new Map<string, number>(),
  };

  ngOnInit(): void {
    this.getAllProducts();
    this.loadRecentSearches(); 
    this.loadStats();
  }
  ngAfterViewInit(): void {
    this.initCharts();
  }

  onSearch() {
    if (!this.searchQuery.trim()) {
      this.filteredProducts = [...this.listProducts];
      return;
    }

    this.filterProducts(this.searchQuery);
    this.addToRecentSearches(this.searchQuery);
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

  loadStats() {
    this.idUser=localStorage.getItem('userId')
    ? parseInt(localStorage.getItem('userId')!)
    : 0;
    this.dashboardService.getPartnerDashboardStats(this.idUser).subscribe((response) => {
      console.log(response);
      
      this.stats.totalProducts = response.totalProducts;
      this.stats.averageRating = response.averageRating;
      this.stats.totalSales = response.totalSales;
      this.stats.totalRevenue = response.totalRevenue;
      response.topSellingProducts.forEach((value: number, key: string) => {
        this.nameList.push(key);
        this.quntityList.push(value);
      });

    })
    // this.stats.topSellingProducts
    console.log(this.nameList);
    console.log(this.quntityList);
    
    
      // Uncomment if you have average rating in the response
      // this.stats.averageRating = response.averageRating;
  }

  loadRecentSearches() {
    const saved = localStorage.getItem('recentSearches');
    this.recentSearches = saved ? JSON.parse(saved) : [];
  }

  applySearch(term: string) {
    this.searchQuery = term;
    this.onSearch();
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
    //   this.listProducts.sort((a, b) => {
    //     return a.availableQuantity - b.availableQuantity;
    //   }
    // ).map((product) => {
    //     this.nameList.push(product.product_name);
    //     this.quntityList.push(product.availableQuantity);
    // });
    });
  }

  initCharts(): void {
    // Sales Chart
    new Chart(this.salesChartRef.nativeElement, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Monthly Sales',
          data: [12, 19, 15, 27, 34, 42],
          borderColor: '#f83182',
          backgroundColor: '#f8318230',
          tension: 0.3,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });

    // Products Chart
    new Chart(this.productsChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: this.nameList,
        datasets: [{
          label: 'Units Sold',
          data: this.quntityList,
          backgroundColor: [
            '#f83182',
            '#fe9a7a',
            '#ff617c',
            '#5cb85c'
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y'
      }
    });
  }

  getProductSales(productId: number): number {
    // Replace with actual logic
    return Math.floor(Math.random() * 100);
  }

  openAddProductModal(): void {
    this.showAddProductModal = true;
  }

  closeModal(): void {
    this.showAddProductModal = false;
  }

  handleProductAdded(product: any): void {
    this.listProducts.unshift(product);
    this.filteredProducts.unshift(product);
    this.stats.totalProducts++;
    this.closeModal();
  }

  editProduct(productId: number): void {
    // Implement edit functionality
    console.log('Edit product', productId);
  }

  confirmDelete(productId: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      // this.productService.deleteProduct(productId).subscribe({
      //   next: () => {
      //     this.products = this.products.filter(p => p.product_id !== productId);
      //     this.filteredProducts = this.filteredProducts.filter(p => p.product_id !== productId);
      //     this.stats.totalProducts--;
      //   },
      //   error: (err) => console.error('Failed to delete product', err)
      // });
    }
  }

  applyFilters(): void {
    this.filteredProducts = this.listProducts.filter(product => {
      const matchesSearch = product.product_name.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesCategory = this.categoryFilter ? product.category === this.categoryFilter : true;
      return matchesSearch && matchesCategory;
    });
  }
}

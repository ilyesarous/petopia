import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
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
  @ViewChild('progressChart') progressChartRef!: ElementRef;
  @ViewChild('topProductsChart') topProductsChartRef!: ElementRef;
  @ViewChild('dailySalesChart') dailySalesChartRef!: ElementRef;
  
  progressChart!: Chart;
  topProductsChart!: Chart;
  loading = true;
  error: string | null = null;

  listProducts: Product[] = [];
  searchQuery: string = '';
  recentSearches: string[] = [];
  filteredProducts: Product[] = [];
  
  categoryFilter = '';
  categories = ['ACCESSORY', 'FOOD', 'TOY', 'GROOMING'];
  showAddProductModal = false;
  idUser = 0;
  //added
  currentProduct: Product | null = null;
  isEditMode: boolean = false;
  constructor(
    private productService: ProductService,
    private dashboardService: DashboardService,
    private route: Router
  ) {
    Chart.register(...registerables);
  }

  partnerName = 'John Doe'; // Replace with actual partner name
  stats = {
    totalProducts: 0,
    averageRating: 0,
    totalSales: 0,
    totalRevenue: 0,
    // topSellingProducts:
  };

  ngOnInit(): void {
    this.idUser = localStorage.getItem('userId')
      ? parseInt(localStorage.getItem('userId')!)
      : 0;
    this.getAllProducts();
    this.loadRecentSearches();
    this.loadDashboardData();
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

  loadDashboardData(): void {
    this.dashboardService.getDashboardData(this.idUser).subscribe({
      next: (data) => {
        console.log('Dashboard data:', data);
        
        this.stats.averageRating = data.averageRating;
        this.stats.totalSales = data.totalSales;
        this.stats.totalRevenue = data.totalRevenue;
        this.stats.topSellingProducts = data.topSellingProducts
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
      this.stats.totalProducts = this.listProducts.length;
    });
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
      const index = this.listProducts.findIndex(p => p.product_id === updatedProduct.product_id);
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
        error: (err) => console.error('Failed to delete product', err)
      });
    }
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

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/models/product/Product';
import { CartService } from 'src/app/services/store/cart/cart.service';
import { FeedbackService } from 'src/app/services/store/feedback/feedback.service';
import { ProductService } from 'src/app/services/store/products/product.service';
import { AuthService } from 'src/app/services/user/auth.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  listProducts: Product[] = [];
  foodList: Product[] = [];
  toysList: Product[] = [];
  clothesList: Product[] = [];
  userId: number = 0;
  AccessoriesList: Product[] = [];
  searchQuery: string = '';
  recentSearches: string[] = [];
  filteredProducts: Product[] = [];
  favoriteCount: number = 0; // You'll want to update this dynamically
  cartItemCount: number = 0; // You'll want to update this dynamically
  p: number = 1; // Page actuelle
  itemsPerPage: number = 4; // Nombre d'éléments par page
  bestSeller: Product[] = [];
  categories: any[] = [];
  currentProduct: Product | null = null;
  showAddProductModal = false;
  isEditMode: boolean = false;
  role: string = "";

  constructor(private service: ProductService, private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.getBestSellers();
    this.getAllProducts();
    this.loadRecentSearches(); 
    this.authService.role.subscribe((role) => {
      this.role = role || ''; // Ensure role is never undefined
    });
  }

  getBestSellers() {
    this.service.getBestSellers().subscribe((data) => {
      this.bestSeller = data;
    });
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
    this.service.getAllProducts().subscribe((data) => {
      this.listProducts = data;

      this.AccessoriesList = data.filter(
        (product) => product.category === 'ACCESSORY'
      );
      this.foodList = data.filter((product) => product.category === 'FOOD');
      this.toysList = data.filter((product) => product.category === 'TOYS');
      this.clothesList = data.filter((product) => product.category === 'CLOTHES');
      this.categories = [
        { titel: 'Food', items: this.foodList, currentPage: 1 },
        { titel: 'Accessories', items: this.AccessoriesList, currentPage: 1 },
        { titel: 'Toys', items: this.toysList, currentPage: 1 },
        { titel: 'Clothes', items: this.clothesList, currentPage: 1 },
        { titel: 'Products', items: this.listProducts, currentPage: 1 },
      ];

      this.favoriteCount = this.listProducts.filter(
        (product) => product.liked === true
      ).length;
      
      this.filteredProducts = [...this.listProducts];
    });
  }

  // Add these methods
  viewFavorites() {
    // Navigate to favorites page or show favorites modal
    this.router.navigate(['favorites']);
  }

  viewCart() {
    // Navigate to cart page or show cart modal
    this.router.navigate(['cart']);
  }

  addNewProduct(){
      this.currentProduct = null;
      this.isEditMode = false;
      this.showAddProductModal = true;
      this.role
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
    }
    this.closeModal();
  }

  getPaginatedItems(category: any): any[] {
    const start = (category.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return category.items.slice(start, end);
  }
  
  getTotalPages(category: any): number {
    return Math.ceil(category.items.length / this.itemsPerPage);
  }
  
  getPages(category: any): number[] {
    const total = this.getTotalPages(category);
    return Array.from({length: total}, (_, i) => i + 1);
  }
  
  prevPage(category: any): void {
    if (category.currentPage > 1) {
      category.currentPage--;
    }
  }
  
  nextPage(category: any): void {
    if (category.currentPage < this.getTotalPages(category)) {
      category.currentPage++;
    }
  }
  
  setPage(category: any, page: number): void {
    category.currentPage = page;
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/models/product/Product';
import { CartService } from 'src/app/services/store/cart/cart.service';
import { FeedbackService } from 'src/app/services/store/feedback/feedback.service';
import { ProductService } from 'src/app/services/store/products/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  listProducts: Product[] = [];
  foodList: Product[] = [];
  userId: number = 0;
  AccessoriesList: Product[] = [];
  searchQuery: string = '';
  recentSearches: string[] = [];
  filteredProducts: Product[] = [];
  favoriteCount: number = 0; // You'll want to update this dynamically
  cartItemCount: number = 0; // You'll want to update this dynamically
  p: number = 1; // Page actuelle
  itemsPerPage: number = 4; // Nombre d'éléments par page

  categories: any[] = [];

  constructor(private service: ProductService, private cartService: CartService, private router: Router) {}

  ngOnInit() {
    this.getAllProducts();
    this.loadRecentSearches(); 
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
      this.categories = [
        { titel: 'Food', items: this.foodList, currentPage: 1 },
        { titel: 'Accessories', items: this.AccessoriesList, currentPage: 1 },
        { titel: 'Products', items: this.listProducts, currentPage: 1 },
      ];

      this.favoriteCount = this.listProducts.filter(
        (product) => product.liked === true
      ).length;
      
      this.filteredProducts = [...this.listProducts];
    });
    this.cartService.getNbItemsInCart(this.userId).subscribe((response) => {
      this.cartItemCount = response;
      console.log(response);
      
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

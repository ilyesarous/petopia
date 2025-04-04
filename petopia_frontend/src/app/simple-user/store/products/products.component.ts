import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/models/product/Product';
import { FeedbackService } from 'src/app/services/store/feedback/feedback.service';
import { ProductService } from 'src/app/services/store/products/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  listProducts: Product[] = [];
  searchQuery: string = '';
  recentSearches: string[] = [];
  filteredProducts: Product[] = [];
  favoriteCount: number = 0; // You'll want to update this dynamically
  cartItemCount: number = 5; // You'll want to update this dynamically

  constructor(
    private service: ProductService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.getAllProducts();
    this.loadRecentSearches(); // Initialize with all products
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

      this.favoriteCount = this.listProducts.filter(
        (product) => product.liked === true
      ).length;

      // this.listProducts.map((product) => {
      //   product.old_price =
      //     product.product_price -
      //     (product.product_price * product.cuppon_price) / 100;
      // });
      this.filteredProducts = [...this.listProducts];
    });
  }

  // Add these methods
  viewFavorites() {
    // Navigate to favorites page or show favorites modal
    this.router.navigate(['favorites']);
    console.log('View favorites clicked');
  }

  viewCart() {
    // Navigate to cart page or show cart modal
    console.log('View cart clicked');
  }
}

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/models/product/Product';
import { ProductService } from 'src/app/services/store/products/product.service';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.css'],
})
export class FavoriteComponent {
  wishlistItems: Product[] = [];

  constructor(
    private wishlistService: ProductService,
    private router: Router
  ) 
  {}

  ngOnInit(): void {
    this.loadWishlist();
  }

  loadWishlist() {
    this.wishlistService.getAllProducts().subscribe((items: Product[]) => {
      this.wishlistItems = items.filter((item) => item.liked);
    });
  }

  removeFromWishlist(product: Product) {
    if (product) {
      product.liked = !product.liked;
      this.wishlistService
        .updateLikedProduct(product.product_id)
        .subscribe((response) => {
          this.loadWishlist();
        });
    }
  }

  clearWishlist() {
    this.wishlistItems.map((item) => {
      item.liked = false;
      this.wishlistService
        .updateLikedProduct(item.product_id)
        .subscribe((response) => {
          this.loadWishlist();
        });
    });
  }

  viewProduct(productId: number) {
    this.router.navigate(['/home/products', productId]);
  }
}

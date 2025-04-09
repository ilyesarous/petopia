import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/models/product/Product';
import { CartService } from 'src/app/services/store/cart/cart.service';
import { ProductService } from 'src/app/services/store/products/product.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent {
  product: Product | undefined;
  mainImage: string = '';
  selectedVariant: any;
  quantity: number = 1;
  userId: number = 0;

  constructor(
    private routeAc: ActivatedRoute,
    private route: Router,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const productId = this.routeAc.snapshot.paramMap.get('id');
    this.userId = localStorage.getItem('userId')
      ? parseInt(localStorage.getItem('userId')!)
      : 0;
    if (productId) {
      this.productService.getProductById(+productId).subscribe((product) => {
        this.product = product;
        this.mainImage = this.product!.product_image;
      });
    }
  }
  getImageUrl(imagePath: string): string {
    return this.productService.getProductImageUrl(imagePath);
  }
  increaseQuantity() {
    this.quantity++;
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart() {
    if (this.product) {
      this.cartService
        .addToCart(this.userId, this.product.product_id, this.quantity)
        .subscribe(() => {
          this.route.navigate(['/cart']);
        });
    }
  }

  toggleWishlist() {
    if (this.product) {
      this.product.liked = !this.product.liked;
      this.productService
        .updateLikedProduct(this.product.product_id)
        .subscribe((response) => {
          console.log('Product updated successfully:', response);
        });
    }
  }
}

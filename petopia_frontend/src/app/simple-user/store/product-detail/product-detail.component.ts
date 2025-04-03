import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/models/product/Product';
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

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
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
      // Implement your cart service logic here
      console.log('Added to cart:', {
        product: this.product,
        variant: this.selectedVariant,
        quantity: this.quantity,
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

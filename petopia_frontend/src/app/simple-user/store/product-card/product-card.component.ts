import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/models/product/Product';
import { CartService } from 'src/app/services/store/cart/cart.service';
import { ProductService } from 'src/app/services/store/products/product.service';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Input() inCart: boolean = false; // Flag to determine if the user is an admin

  constructor(
    private router: Router,
    private service: ProductService,
    private cartService: CartService
  ) {}


  toggleWishlist() {
    if (this.product) {
      this.product.liked = !this.product.liked;
      this.service
        .updateLikedProduct(this.product.product_id)
        .subscribe((response) => {
          console.log('Product updated successfully:', response);
        });
    }
  }

  showProductDetails(productId: number) {
    this.router.navigate(['products', productId]);
  }

  addToCart() {
    const userId = localStorage.getItem('userId')
      ? parseInt(localStorage.getItem('userId')!)
      : 0;
    const productId = this.product.product_id;
    const quantity = 1; // Default quantity to add

    this.cartService
      .addToCart(userId, productId, quantity)
      .subscribe((response) => {
        console.log('Product added to cart:', response);
      }); // Update the cart item count
  }

  increaseQuantity() {
    const userId = localStorage.getItem('userId')
      ? parseInt(localStorage.getItem('userId')!)
      : 0;
    const productId = this.product.product_id;

    this.cartService.increaseQuantity(userId, productId).subscribe((response) => {
      console.log('Product quantity increased:', response);
    });
  }

  decreaseQuantity() {
    const userId = localStorage.getItem('userId')
      ? parseInt(localStorage.getItem('userId')!)
      : 0;
    const productId = this.product.product_id;

    this.cartService.decreaseQuantity(userId, productId).subscribe((response) => {
      console.log('Product quantity decreased:', response);
    });
  }

}

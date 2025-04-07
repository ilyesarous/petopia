import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/store/cart/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  cart: any = {};
  
  constructor(public cartService: CartService) {}

  userId: number = 0;
  ngOnInit(): void {
    this.userId = localStorage.getItem('userId')
      ? parseInt(localStorage.getItem('userId')!)
      : 0;
    this.getcartItems();
  }

  getcartItems() {
    this.cartService.getCartByUserId(this.userId).subscribe((response) => {
      this.cartItems = response.cartProducts;
      this.cart = response;
    });
  }

  increaseQuantity(productId: number): void {
    this.cartService
      .increaseQuantity(this.userId, productId)
      .subscribe((response) => {
        this.cartItems = response.cartProducts;
        this.cart = response;
      });
  }

  decreaseQuantity(productId: number): void {
    this.cartService
      .decreaseQuantity(this.userId, productId)
      .subscribe((response) => {
        this.cartItems = response.cartProducts;
        this.cart = response;
      });
  }

  removeItem(productId: number): void {
    this.cartService.removeItem(this.userId, productId).subscribe((response) => {
      this.cartItems = response.cartProducts;
      this.cart = response;
    });
  }

  clearCart(): void {
    this.cartService.clearCart(this.userId).subscribe((response) => {
      this.cartItems = [];
      this.cart = response;
    });
  }
}

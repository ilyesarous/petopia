import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Product } from 'src/app/models/product/Product';
import { CartService } from 'src/app/services/store/cart/cart.service';
import { PdfService } from 'src/app/services/store/cart/pdf.service';
import { StripePaymentService } from 'src/app/services/vet/payment/stripe-payment.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  @ViewChild('receipt') receipt!: ElementRef;
  cartItems: any[] = [];
  cart: any = {};
  error: string | null = null;
  today: Date = new Date();
  showReceiptModal = false;

  constructor(
    public cartService: CartService,
    private stripeService: StripePaymentService,
    private pdfService: PdfService
  ) {}

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

  increaseQuantity(product: Product): void {
    if (product.availableQuantity > 1) {
      this.cartService
      .increaseQuantity(this.userId, product.product_id)
      .subscribe((response) => {
        this.cartItems = response.cartProducts;
        this.cart = response;
      });
    }
    else alert("quantity unavailable!")
  }

  decreaseQuantity(productId: number, item: any): void {
    if (item.quantity > 1) {
      this.cartService
      .decreaseQuantity(this.userId, productId)
      .subscribe((response) => {
        this.cartItems = response.cartProducts;
        this.cart = response;
      }); 
    }
    else alert("you can't decrease the quantity")
  }

  removeItem(productId: number): void {
    this.cartService
      .removeItem(this.userId, productId)
      .subscribe((response) => {
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

  checkout(): void {
    this.cartService.checkout(this.userId).subscribe((response) => {
      console.log(response);
      
      this.cartItems = []
      this.cart= response
    })
  }

  openReceiptModal() {
    this.showReceiptModal = true;
  }

  closeReceiptModal() {
    this.showReceiptModal = false;
  }

  async processPayment() {
    try {
      // Generate PDF first
      const receiptContent = document.getElementById('receipt-content');
      if (receiptContent) {
        await this.pdfService.generatePdf(receiptContent, 'receipt.pdf');
      } else {
        throw new Error('Receipt content element not found');
      }
      
      // Then proceed with payment
      const paymentRequest = {
        amount: this.cart.total_price,
        currency: 'TND',
        type: 'SHOP',
        description: 'cart services payment',
        paymentDate: new Date().toISOString(),
        userId: this.userId,
        cartId: this.cart.cartId
      };

      this.stripeService.createCheckoutSessionWithShop(paymentRequest).subscribe({
        next: (response: any) => {
          this.stripeService.redirectToCheckoutShop(response.sessionId);
          this.closeReceiptModal();
          this.checkout()
        },
        error: (err) => {
          this.error = 'Failed to create payment session';
          console.error(err);
          this.closeReceiptModal();
        },
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      this.closeReceiptModal();
    }
  }
}

import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/models/product/Product';
import { ProductService } from 'src/app/services/store/products/product.service';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
})
export class ProductCardComponent {
  @Input() product!: Product;

  constructor(
    private router: Router,
    private service: ProductService,
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

}

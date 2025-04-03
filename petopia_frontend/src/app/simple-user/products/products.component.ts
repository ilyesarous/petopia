import { Component } from '@angular/core';
import { Product } from 'src/app/models/product/Product';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent {
  listProducts: Product[] = [
    {
      product_id: 1,
      product_name: 'test',
      product_description: 'test test',
      product_price: 12.35,
      category: 'ACCESSORY',
      isLiked: false,
      availableQuantity: 20,
      cuppon_price: 1,
      product_image: '../../../assets/images/store/product/food1.png',
    },
    {
      product_id: 2,
      product_name: 'aaa',
      product_description: 'test ',
      product_price: 12,
      category: 'ACCESSORY',
      isLiked: false,
      availableQuantity: 10,
      cuppon_price: 1,
      product_image: '../../../assets/images/store/product/food2.png',
    },
    {
      product_id: 2,
      product_name: 'aaa',
      product_description: 'test ',
      product_price: 12,
      category: 'ACCESSORY',
      isLiked: false,
      availableQuantity: 10,
      cuppon_price: 1,
      product_image: '../../../assets/images/store/product/food3.png',
    },
    {
      product_id: 2,
      product_name: 'aaa',
      product_description: 'test ',
      product_price: 12,
      category: 'ACCESSORY',
      isLiked: false,
      availableQuantity: 10,
      cuppon_price: 1,
      product_image: '../../../assets/images/store/product/food4.png',
    },
    {
      product_id: 2,
      product_name: 'aaa',
      product_description: 'test ',
      product_price: 12,
      category: 'ACCESSORY',
      isLiked: false,
      availableQuantity: 10,
      cuppon_price: 1,
      product_image: '../../../assets/images/store/product/food5.png',
    },
  ];
}

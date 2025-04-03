export class Product {
  product_id!: number;
  product_image!: string;
  product_name!: string;
  product_description!: string;
  product_price!: number;
  old_price?: number;
  cuppon_price = 0;
  category!: string;
  liked!: boolean;
  rating!: number;
  review_count?: number;
  availableQuantity!: number;
}

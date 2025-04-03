import { Product } from "./Product";

export class Feedback {
  feedback_id!: number;
  description!: string;
  stars_number!: number;
  sentiment!: string;
  user_id!: number;
  productId!: number;
  created_at!: Date;
  updated_at!: Date;
}

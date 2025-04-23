import { Product } from "./Product";

export class Feedback {
  feedback_id!: number;
  description!: string;
  stars_number!: number;
  sentiment!: string;
  user!: {id_user: number};
  productId!: number;
  createdAt!: Date;
  updated_at!: Date;
}

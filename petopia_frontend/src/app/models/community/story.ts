export class User {
  id_user!: number;
  name!: string;
  role!: string;
}
export interface Story {
    id: number;
    user: User;
    image?: string;
    text?: string;
    createdAt: Date;
    expiresAt: Date;
  }
  
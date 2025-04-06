import { Reaction } from "./reaction";

export enum PostType {
    LOST_PET = 'Lost Pet',
    ADOPTION = 'Adoption',
    GENERAL = 'General',
    ADVICE = 'Advice',
    FOR_SALE = 'For Sale'
  }
      //TODO

  export class User {
    id_user!: number;
    name!: string;
    role!: string;
  }
  
  export interface Post {
    id: number;
    title: string;
    content: string;
    image?: string;
    postType: PostType;
    date: Date;
    updatedAt?: Date;
    user?:User;
    comments?: Comment[];
    reactions?: Reaction[];
  }
  
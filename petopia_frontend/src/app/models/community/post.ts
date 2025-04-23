// post.ts
import { Comment as PostComment } from './comment';
import { Reaction } from './reaction';

export enum PostType {
    LOST_PET = 'Lost Pet',
    ADOPTION = 'Adoption',
    GENERAL = 'General',
    ADVICE = 'Advice',
    FOR_SALE = 'For Sale',
    NEWS = 'NEWS'
}

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
  user?: User;
  comments?: PostComment[];  
  reactions?: Reaction[];
  isEditing?: boolean;
  editedContent?: string;
  menuOpen?: boolean;
  editedPostType?: PostType;

}

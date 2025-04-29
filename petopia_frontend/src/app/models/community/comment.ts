export class User {
  id_user!: number;
  name!: string;
  role!: string;
}
export interface Comment {
    id?: number;  
    postId: number;
    user?:User; 
    content: string;
    date: Date;  
    isEditing?: boolean;
    editedContent?: string;
    menuOpen?: boolean;
  }
  
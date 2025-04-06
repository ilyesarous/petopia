export enum ReactionType {
    LIKE = 'Like',
    LOVE = 'Love',
    WOW = 'Wow',
    HAHA = 'Haha',
    SAD = 'Sad'
  }
  export class User {
    id_user!: number;
    name!: string;
    role!: string;
  }
  export interface Reaction {
    id?: number;
    postId: number;
    user?: User;
    type: ReactionType;

  }
  
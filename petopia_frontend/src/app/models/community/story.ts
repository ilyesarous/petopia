export interface Story {
    id: number;
    authorId: number;
    imageUrl?: string;
    text?: string;
    createdAt: Date;
    expiresAt: Date;
  }
  
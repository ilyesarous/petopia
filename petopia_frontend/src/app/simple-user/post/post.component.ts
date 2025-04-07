import { Component, Input, OnInit } from '@angular/core';
import { Reaction } from '../../models/community/reaction';
import { ReactionService } from '../../services/community/reaction.service';
import { Post } from '../../models/community/post';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  @Input() post!: Post;
  showComments: boolean = false;
  showAllComments: boolean = false;
  showLikesPopup: boolean = false;

  // Track the reaction type the current user has selected
  userReaction: string | null = null;

  constructor(private reactionService: ReactionService) {}

  ngOnInit(): void {
    // When the component loads, determine if the user already reacted
    const userIdStr = localStorage.getItem('userId');
    if (userIdStr && this.post.reactions) {
      const currentUserId = parseInt(userIdStr, 10);
      const existingReaction = this.post.reactions.find(
        (r: Reaction) => r.user?.id_user === currentUserId
      );
      if (existingReaction) {
        this.userReaction = existingReaction.type;
      }
    }
  }

  toggleComments(): void {
    this.showComments = !this.showComments;
    if (!this.showComments) {
      this.showAllComments = false;
    }
  }

  getDisplayedComments(): any[] {
    return this.post.comments
      ? this.showAllComments
        ? this.post.comments
        : this.post.comments.slice(0, 3)
      : [];
  }

  openLikesPopup(): void {
    this.showLikesPopup = true;
  }

  closeLikesPopup(): void {
    this.showLikesPopup = false;
  }

  getReactionSummary(): string {
    if (!this.post.reactions || this.post.reactions.length === 0) {
      return 'No Reactions';
    }
    const count = this.post.reactions.length;
    return count === 1 ? '1 Reaction' : `${count} Reactions`;
  }

  addReaction(type: string): void {
    const userIdStr = localStorage.getItem('userId');
    if (!userIdStr) {
      console.error('No userId found in localStorage. Please log in.');
      return;
    }
    const currentUserId = parseInt(userIdStr, 10);

    // Ensure the reactions array exists
    if (!this.post.reactions) {
      this.post.reactions = [];
    }

    // Check if the current user already has a reaction on this post
    const existingIndex = this.post.reactions.findIndex(
      r => r.user?.id_user === currentUserId
    );

    if (existingIndex !== -1) {
      const existingReaction = this.post.reactions[existingIndex];
      if (existingReaction.type === type) {
        // Remove reaction if the same type is clicked
        this.reactionService.removeReaction(existingReaction.id!).subscribe({
          next: () => {
            this.post.reactions!.splice(existingIndex, 1);
            this.userReaction = null;
          },
          error: (err: any) => {
            console.error('Error removing reaction:', err);
          }
        });
      } else {
        // Update reaction if a different type is selected
        this.reactionService.updateReaction(existingReaction.id!, type).subscribe({
          next: (updatedReaction: Reaction) => {
            this.post.reactions![existingIndex] = updatedReaction;
            this.userReaction = type;
          },
          error: (err: any) => {
            console.error('Error updating reaction:', err);
          }
        });
      }
    } else {
      // Add a new reaction if none exists for the current user
      this.reactionService.addReaction(this.post.id, type).subscribe({
        next: (newReaction: Reaction) => {
          this.post.reactions!.push(newReaction);
          this.userReaction = type;
        },
        error: (err: any) => {
          console.error('Error adding reaction:', err);
        }
      });
    }
  }
}

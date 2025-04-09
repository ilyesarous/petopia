import { Component, Input, OnInit } from '@angular/core';
import { Reaction } from '../../models/community/reaction';
import { ReactionService } from '../../services/community/reaction.service';
import { Post } from '../../models/community/post';
import { Comment } from '../../models/community/comment';
import { CommentService } from '../../services/community/comment.service';
import { PostService } from '../../services/community/post.service';

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
  
  userReaction: string | null = null;
  newComment: string = '';
  currentUserId: number | null = null;
  isDeleted: boolean = false;  // Add flag for deletion

  constructor(
    private reactionService: ReactionService,
    private commentService: CommentService,
    private postService: PostService
  ) {}

  ngOnInit(): void {
    const userIdStr = localStorage.getItem('userId');
    if (userIdStr) {
      this.currentUserId = parseInt(userIdStr, 10);
    }
    if (this.currentUserId && this.post.reactions) {
      const existingReaction = this.post.reactions.find(
        (r: Reaction) => r.user?.id_user === this.currentUserId
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

  getDisplayedComments(): Comment[] {
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

    if (!this.post.reactions) {
      this.post.reactions = [];
    }
    const existingIndex = this.post.reactions.findIndex(
      r => r.user?.id_user === currentUserId
    );
    if (existingIndex !== -1) {
      const existingReaction = this.post.reactions[existingIndex];
      if (existingReaction.type === type) {
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

  // Post editing/deleting for post owner

  isPostOwner(): boolean {
    return this.currentUserId !== null && this.post.user?.id_user === this.currentUserId;
  }

  editPost(): void {
    this.post['isEditing'] = true;
    this.post['editedContent'] = this.post.content;
    this.post['menuOpen'] = false;
  }

  cancelPostEdit(): void {
    this.post['isEditing'] = false;
  }

  updatePost(): void {
    const updatedContent = this.post['editedContent'];
    if (!updatedContent || !this.post.id) return;
    this.postService.updatePost(this.post.id, { ...this.post, content: updatedContent }).subscribe({
      next: (updatedPost: Post) => {
        this.post.content = updatedPost.content;
        this.post['isEditing'] = false;
      },
      error: (err: any) => {
        console.error('Error updating post:', err);
      }
    });
  }

  deletePost(): void {
    if (!this.post.id) return;
    this.postService.deletePost(this.post.id).subscribe({
      next: () => {
        console.log('Post deleted successfully');
        // Set the deletion flag to hide the post from the UI
        this.isDeleted = true;
      },
      error: (err: any) => {
        console.error('Error deleting post:', err);
      }
    });
  }

  // Comment methods (same as before)
  toggleCommentMenu(comment: Comment): void {
    (this.post.comments || []).forEach(c => {
      if (c.id !== comment.id) {
        c['menuOpen'] = false;
      }
    });
    comment['menuOpen'] = !comment['menuOpen'];
  }

  isCommentOwner(comment: Comment): boolean {
    return this.currentUserId !== null && comment.user?.id_user === this.currentUserId;
  }

  deleteComment(commentId: number): void {
    this.commentService.deleteComment(commentId).subscribe({
      next: () => {
        if (this.post.comments) {
          this.post.comments = this.post.comments.filter(c => c.id !== commentId);
        }
      },
      error: (err: any) => {
        console.error('Error deleting comment:', err);
      }
    });
  }

  editComment(comment: Comment): void {
    comment['isEditing'] = true;
    comment['editedContent'] = comment.content;
    comment['menuOpen'] = false;
  }

  cancelEdit(comment: Comment): void {
    comment['isEditing'] = false;
  }

  updateComment(comment: Comment): void {
    const updatedContent = comment['editedContent'];
    if (!updatedContent || !comment.id) return;
    this.commentService.updateComment(comment.id, updatedContent).subscribe({
      next: (updatedComment: Comment) => {
        comment.content = updatedComment.content;
        comment['isEditing'] = false;
      },
      error: (err: any) => {
        console.error('Error updating comment:', err);
      }
    });
  }

  addComment(): void {
    if (!this.newComment.trim()) return;
    const userIdStr = localStorage.getItem('userId');
    if (!userIdStr) {
      console.error('No userId found in localStorage. Please log in.');
      return;
    }
    const currentUserId = parseInt(userIdStr, 10);
    this.commentService.addComment(currentUserId, this.post.id, this.newComment).subscribe({
      next: (comment: Comment) => {
        if (!this.post.comments) {
          this.post.comments = [];
        }
        this.post.comments.push(comment);
        this.newComment = '';
      },
      error: (err: any) => {
        console.error('Error adding comment:', err);
      }
    });
  }
}

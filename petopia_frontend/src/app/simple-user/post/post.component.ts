import { Component, Input, OnInit } from '@angular/core';
import { Reaction } from '../../models/community/reaction';
import { ReactionService } from '../../services/community/reaction.service';
import { Post } from '../../models/community/post';
import { Comment } from '../../models/community/comment';
import { CommentService } from '../../services/community/comment.service';
import { PostService } from '../../services/community/post.service';
import { NgForm } from '@angular/forms';
import { TranslationService } from 'src/app/services/community/translation.service';


@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  @Input() post!: Post;
  showComments = false;
  showAllComments = false;
  showLikesPopup = false;
  userReaction: string | null = null;
  newComment = '';
  currentUserId: number | null = null;
  isDeleted = false;

  selectedPostImageFile: File | null = null;
  selectedPostImagePreview: string | null = null;
  removeImage = false;
  selectedPostImageFiles: File[] = [];
selectedPostImagePreviews: string[] = [];


  activeCommentAction: string | null = null;
  activeCommentId: number | null = null;
  deletedImageIndexes: number[] = [];

  likeSound = new Audio('https://res.cloudinary.com/dkdx59xe9/video/upload/v1709508219/Facebook_Like_Sound_Effect_nbc6ju.mp3');

  //translation
  translatedPost: string | null = null;
translatedComments: { [id: number]: string } = {};
selectedLanguage: string = 'en';
// view more
expanded: boolean = false;
readonly MAX_LENGTH = 450;
MAX_TRANSLATED_LENGTH = 350;
translatedExpanded: boolean = false;




  constructor(
    private reactionService: ReactionService,
    private commentService: CommentService,
    private postService: PostService,
    private translationService: TranslationService

  ) {}

  ngOnInit(): void {
    const userIdStr = localStorage.getItem('userId');
    if (userIdStr) {
      this.currentUserId = parseInt(userIdStr, 10);
    }
    if (this.currentUserId && this.post.reactions) {
      const existingReaction = this.post.reactions.find(
        r => r.user?.id_user === this.currentUserId
      );
      if (existingReaction) {
        this.userReaction = existingReaction.type;
      }
    }
  }

  // Reactions
  addReaction(type: string): void {
    this.likeSound.play().catch(e => console.error('Failed to play sound:', e));

    const userIdStr = localStorage.getItem('userId');
    if (!userIdStr) return;
    const currentUserId = parseInt(userIdStr, 10);

    const existingIndex = this.post.reactions?.findIndex(r => r.user?.id_user === currentUserId) ?? -1;
    if (existingIndex !== -1) {
      const existingReaction = this.post.reactions![existingIndex];
      if (existingReaction.type === type) {
        this.reactionService.removeReaction(existingReaction.id!).subscribe({
          next: () => {
            this.post.reactions!.splice(existingIndex, 1);
            this.userReaction = null;
          },
          error: console.error
        });
      } else {
        this.reactionService.updateReaction(existingReaction.id!, type).subscribe({
          next: updated => {
            this.post.reactions![existingIndex] = updated;
            this.userReaction = type;
          },
          error: console.error
        });
      }
    } else {
      this.reactionService.addReaction(this.post.id, type).subscribe({
        next: newReaction => {
          this.post.reactions?.push(newReaction);
          this.userReaction = type;
        },
        error: console.error
      });
    }
  }

  getReactionSummary(): string {
    const count = this.post.reactions?.length ?? 0;
    return count === 0 ? 'No Reactions' : `${count} Reaction${count > 1 ? 's' : ''}`;
  }

  toggleComments(): void {
    this.showComments = !this.showComments;
    if (!this.showComments) this.showAllComments = false;
  }

  getDisplayedComments(): Comment[] {
    return this.post.comments ? (this.showAllComments ? this.post.comments : this.post.comments.slice(0, 3)) : [];
  }

  openLikesPopup(): void {
    this.showLikesPopup = true;
  }

  closeLikesPopup(): void {
    this.showLikesPopup = false;
  }

  // Post
  isPostOwner(): boolean {
    return this.currentUserId !== null && this.post.user?.id_user === this.currentUserId;
  }
  activePostAction: string | null = null;
  activePostId: number | null = null;
  
  setActivePostAction(action: string, id: number): void {
    this.activePostAction = action;
    this.activePostId = id;
  }
  editPost(): void {
    this.post['isEditing'] = true;
    this.post['editedContent'] = this.post.content;
    this.post['editedPostType'] = this.post.postType;
    this.post['menuOpen'] = false;
  }
  
  cancelPostEdit(): void {
    this.post['isEditing'] = false;
  this.selectedPostImageFiles = [];
  this.selectedPostImagePreviews = [];
  this.deletedImageIndexes = [];
 
  }



  deletePost(): void {
    if (!this.post.id) return;
    this.postService.deletePost(this.post.id).subscribe({
      next: () => {
        this.isDeleted = true;

      },
      error: console.error
    });
  }
  

  // Comments
  toggleCommentMenu(comment: Comment): void {
    (this.post.comments || []).forEach(c => c['menuOpen'] = c.id === comment.id ? !comment['menuOpen'] : false);
  }

  isCommentOwner(comment: Comment): boolean {
    return this.currentUserId !== null && comment.user?.id_user === this.currentUserId;
  }

  deleteComment(commentId: number): void {
    this.commentService.deleteComment(commentId).subscribe({
      next: () => {
        this.post.comments = this.post.comments?.filter(c => c.id !== commentId);
      },
      error: console.error
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
    if (!comment['editedContent'] || !comment.id) return;
    this.commentService.updateComment(comment.id, comment['editedContent']).subscribe({
      next: updated => {
        comment.content = updated.content;
        comment['isEditing'] = false;
      },
      error: console.error
    });
  }

  addComment(commentForm: NgForm): void {
    if (!this.newComment.trim()) return;
    const userIdStr = localStorage.getItem('userId');
    if (!userIdStr) return;
    const currentUserId = parseInt(userIdStr, 10);

    this.commentService.addComment(currentUserId, this.post.id, this.newComment).subscribe({
      next: comment => {
        this.post.comments = this.post.comments || [];
        this.post.comments.push(comment);
        this.newComment = '';
        commentForm.resetForm();
      },
      error: console.error
    });
  }

  // Image Handling
  onPostImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      Array.from(input.files).forEach(file => {
        this.selectedPostImageFiles.push(file);
  
        const reader = new FileReader();
        reader.onload = () => {
          this.selectedPostImagePreviews.push(reader.result as string);
        };
        reader.readAsDataURL(file);
      });
  
      // Reset input so same file can be picked again if needed
      input.value = '';
    }
  }
  

  removeSelectedImage(index: number): void {
    this.selectedPostImageFiles.splice(index, 1);
    this.selectedPostImagePreviews.splice(index, 1);
  }
  

  getImageList(): string[] {
    return this.post.image?.split(',').filter(img => img.trim()) || [];
  }
  removeImageAtIndex(index: number): void {
    this.deletedImageIndexes.push(index);
  }
  getFilteredImageList(): string[] {
    return this.getImageList().filter((_, i) => !this.deletedImageIndexes.includes(i));
  }

  updatePost(post: Post): void {
    const updatedContent = post['editedContent'];
    const updatedPostType = post['editedPostType'];
    if (!updatedContent || !updatedPostType || !post.id) return;
  
    const formData = new FormData();
    formData.append('content', updatedContent);
    formData.append('postType', updatedPostType.toString().trim().toUpperCase().replace(/ /g, '_'));
  
    const finalImages = this.getFilteredImageList().join(',');
    formData.append('image', finalImages);
  
    this.selectedPostImageFiles.forEach(file => {
      formData.append('files', file, file.name);
    });
  
    this.postService.updatePost(post.id, formData).subscribe({
      next: (updatedPost: Post) => {
        post.content = updatedPost.content;
        post.image = updatedPost.image;
        post.postType = updatedPost.postType;
        post['isEditing'] = false;
        this.selectedPostImageFiles = [];
        this.selectedPostImagePreviews = [];
        this.deletedImageIndexes = [];
      },
      error: (err: any) => {
        console.error('Error updating post:', err);
      }
    });
  }
  
    setActiveAction(action: string, id: any): void {
    this.activeCommentAction = action;
    this.activeCommentId = id;
  }
  getPostTypeBadgeClass(type: string): string {
    switch (type) {
      case 'LOST_PET':
      case 'Lost Pet':
        return 'bg-danger text-white';
      case 'ADOPTION':
      case 'Adoption':
        return 'bg-success text-white';
      case 'GENERAL':
      case 'General':
        return 'bg-secondary text-white';
      case 'ADVICE':
      case 'Advice':
        return 'bg-info text-dark';
      case 'FOR_SALE':
      case 'For Sale':
        return 'bg-warning text-dark';
      default:
        return 'bg-light text-dark';
    }
  }
  translatePost(): void {
    const textToTranslate = this.post.content;
    if (!textToTranslate) return;
  
    this.translationService.translate(textToTranslate, this.selectedLanguage).subscribe({
      next: (translated: string) => {
        this.translatedPost = translated;
        console.log('✅ Translated:', translated);
      },
      error: (err) => {
        console.error('❌ Translation failed:', err);
      }
    });
  }

  get displayContent(): string {
    return this.expanded || this.post.content.length <= this.MAX_LENGTH
      ? this.post.content
      : this.post.content.slice(0, this.MAX_LENGTH) + '...';
  }
  
  toggleExpanded(): void {
    this.expanded = !this.expanded;
  }
  get displayTranslatedPost(): string {
    if (!this.translatedPost) return '';
    return this.translatedExpanded || this.translatedPost.length <= this.MAX_TRANSLATED_LENGTH
      ? this.translatedPost
      : this.translatedPost.slice(0, this.MAX_TRANSLATED_LENGTH) + '...';
  }
  
  toggleTranslatedExpanded(): void {
    this.translatedExpanded = !this.translatedExpanded;
  }
    
    
  
  
  

  
  

}

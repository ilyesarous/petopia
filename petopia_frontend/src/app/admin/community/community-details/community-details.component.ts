import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from 'src/app/models/community/post';
import { Comment } from 'src/app/models/community/comment';
import { Reaction } from 'src/app/models/community/reaction';
import { Story } from 'src/app/models/community/story';
import { PostService } from 'src/app/services/community/post.service';
import { CommentService } from 'src/app/services/community/comment.service';
import { ReactionService } from 'src/app/services/community/reaction.service';
import { StoryService } from 'src/app/services/community/story.service';
import { forkJoin } from 'rxjs';



@Component({
  selector: 'app-community-details',
  templateUrl: './community-details.component.html',
  styleUrls: ['./community-details.component.css']
})
export class CommunityDetailsComponent implements OnInit {
  type!: string;
  id!: number;

  post?: Post;
  comment?: Comment;
  reaction?: Reaction;
  story?: Story;
  comments: Comment[] = [];
  reactions: Reaction[] = [];
  postImages: string[] = [];
  showCommentDeleteSuccess: boolean = false;



  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private postService: PostService,
    private commentService: CommentService,
    private reactionService: ReactionService,
    private storyService: StoryService
  ) {}
  
  ngOnInit(): void {
    this.type = this.route.snapshot.paramMap.get('type')!;
    this.id = Number(this.route.snapshot.paramMap.get('id'));
  
    switch (this.type) {
      case 'post':
        this.postService.getPostById(this.id).subscribe(post => {
          this.post = post;
          this.postImages = post.image?.split(',').map(img => img.trim()).filter(img => img) || [];
          this.commentService.getCommentsByPost(this.id).subscribe(data => this.comments = data);
          this.reactionService.getReactionsByPost(this.id).subscribe(data => this.reactions = data);
        });
        break;
      
      
      case 'comment':
        this.commentService.getCommentById(this.id).subscribe(data => this.comment = data);
        break;
      case 'reaction':
        this.reactionService.getReactionById(this.id).subscribe(data => this.reaction = data);
        break;
      case 'story':
        this.storyService.getStoryById(this.id).subscribe(data => this.story = data);
        break;
    }
  }
  deleteComment(id: number): void {
    if (confirm('Are you sure you want to delete this comment?')) {
      this.commentService.deleteComment(id).subscribe(() => {
        this.comments = this.comments.filter(c => c.id !== id);
        this.showCommentDeleteSuccess = true;
        setTimeout(() => this.showCommentDeleteSuccess = false, 1500);
      });
    }
  }
  getReactionIcon(type: string): string {
    switch (type) {
      case 'LIKE': return 'bi bi-hand-thumbs-up-fill text-primary';
      case 'LOVE': return 'bi bi-heart-fill text-danger';
      case 'WOW': return 'bi bi-emoji-surprise-fill text-warning';
      case 'HAHA': return 'bi bi-emoji-laughing-fill text-orange';
      case 'SAD': return 'bi bi-emoji-frown-fill text-secondary';
      default: return 'bi bi-star-fill text-muted';
    }
  }
  
}

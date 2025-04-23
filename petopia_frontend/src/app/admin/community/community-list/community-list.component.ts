import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Post } from 'src/app/models/community/post';
import { Comment } from 'src/app/models/community/comment';
import { Reaction } from 'src/app/models/community/reaction';
import { Story } from 'src/app/models/community/story';
import { PostService } from 'src/app/services/community/post.service';
import { CommentService } from 'src/app/services/community/comment.service';
import { ReactionService } from 'src/app/services/community/reaction.service';
import { StoryService } from 'src/app/services/community/story.service';


@Component({
  selector: 'app-community-list',
  templateUrl: './community-list.component.html',
  styleUrls: ['./community-list.component.css']
})
export class CommunityListComponent implements OnInit {
  posts: Post[] = [];
  comments: Comment[] = [];
  reactions: Reaction[] = [];
  stories: Story[] = [];
  searchQuery: string = '';
filteredPosts: Post[] = [];
filteredComments: Comment[] = [];
filteredReactions: Reaction[] = [];
filteredStories: Story[] = [];
showAllPosts: boolean = false;
showAllStories: boolean = false;
showDeleteSuccess: boolean = false;




  constructor(
    private postService: PostService,
    private commentService: CommentService,
    private reactionService: ReactionService,
    private storyService: StoryService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.postService.getPosts().subscribe(data => {
      this.posts = data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      this.filteredPosts = [...this.posts];
      this.setupPostPagination();
    });
  
    this.commentService.getAllComments().subscribe(data => {
      this.comments = data.sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime());
      this.filteredComments = [...this.comments];
    });
  
    this.reactionService.getAllReactions().subscribe(data => {
      this.reactions = data;
      this.filteredReactions = [...this.reactions];
    });
    
  
    this.storyService.getStories().subscribe(data => {
      this.stories = data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      this.filteredStories = [...this.stories];
      this.setupStoryPagination();

    });
  }
  
  
  

  viewDetails(type: string, id: number): void {
    this.router.navigate([`/dashboard/community/details/${type}/${id}`]);
  }
  applySearchFilter(): void {
    const query = this.searchQuery.toLowerCase();
  
    this.filteredPosts = this.posts.filter(post =>
      post.title?.toLowerCase().includes(query) ||
      post.content?.toLowerCase().includes(query) ||
      post.postType?.toLowerCase().includes(query) ||
      post.user?.name?.toLowerCase().includes(query)
    );
    this.setupPostPagination();
  
    this.filteredStories = this.stories.filter(story =>
      story.user?.name?.toLowerCase().includes(query)
    );
    this.setupStoryPagination();
  }
  
  deletePost(id: number): void {
    if (confirm('Are you sure you want to delete this post?')) {
      this.postService.deletePost(id).subscribe(() => {
        this.posts = this.posts.filter(p => p.id !== id);
        this.filteredPosts = this.filteredPosts.filter(p => p.id !== id);
        this.showDeleteSuccess = true;
        setTimeout(() => this.showDeleteSuccess = false, 1500);
      });
    }
  }
  
  deleteStory(id: number): void {
    if (confirm('Are you sure you want to delete this story?')) {
      this.storyService.deleteStory(id).subscribe(() => {
        this.stories = this.stories.filter(s => s.id !== id);
        this.filteredStories = this.filteredStories.filter(s => s.id !== id);
        this.showDeleteSuccess = true;
        setTimeout(() => this.showDeleteSuccess = false, 1500);
      });
    }
  }
    // Post pagination
  currentPostPage: number = 1;
  postPageSize: number = 5;
  totalPostPages: number = 0;
  paginatedPosts: Post[] = [];
  postPageNumbers: number[] = [];

  // Story pagination
  currentStoryPage: number = 1;
  storyPageSize: number = 5;
  totalStoryPages: number = 0;
  paginatedStories: Story[] = [];
  storyPageNumbers: number[] = [];
  setupPostPagination(): void {
    this.totalPostPages = Math.ceil(this.filteredPosts.length / this.postPageSize);
    this.postPageNumbers = Array.from({ length: this.totalPostPages }, (_, i) => i + 1);
    this.changePostPage(1);
  }

  changePostPage(page: number): void {
    this.currentPostPage = page;
    const start = (page - 1) * this.postPageSize;
    const end = start + this.postPageSize;
    this.paginatedPosts = this.filteredPosts.slice(start, end);
  }

  setupStoryPagination(): void {
    this.totalStoryPages = Math.ceil(this.filteredStories.length / this.storyPageSize);
    this.storyPageNumbers = Array.from({ length: this.totalStoryPages }, (_, i) => i + 1);
    this.changeStoryPage(1);
  }

  changeStoryPage(page: number): void {
    this.currentStoryPage = page;
    const start = (page - 1) * this.storyPageSize;
    const end = start + this.storyPageSize;
    this.paginatedStories = this.filteredStories.slice(start, end);
  }

  
}

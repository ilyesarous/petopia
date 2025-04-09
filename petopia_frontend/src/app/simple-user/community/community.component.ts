import { Component, OnInit } from '@angular/core';
import { Post, PostType } from '../../models/community/post';
import { PostService } from '../../services/community/post.service';
import { Story } from '../../models/community/story';
import { StoryService } from '../../services/community/story.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.css']
})
export class CommunityComponent implements OnInit {
  // Posts
  posts: Post[] = [];
  originalPosts: Post[] = [];

  // Stories
  stories: Story[] = [];
  chunkedStories: Story[][] = []; // Each sub-array is one carousel slide

  // For creating posts
  newPostContent: string = '';
  selectedFiles: File[] = [];
  newPostType: PostType = PostType.GENERAL;
  PostType = PostType;

  // For searching/filtering posts
  searchQuery: string = '';
  postTypes = Object.values(PostType);
  selectedPostType: PostType | null = null;

  // For creating stories
  showCreateStory: boolean = false;
  newStoryText: string = '';
  selectedStoryFile: File | null = null;

  constructor(
    private postService: PostService,
    private storyService: StoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPosts();
    this.loadStories();
  }

  loadPosts(): void {
    this.postService.getPosts().subscribe(data => {
      // Sort posts newest first
      this.posts = data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      this.originalPosts = [...this.posts];
    });
  }

  loadStories(): void {
    this.storyService.getStories().subscribe({
      next: (data: Story[]) => {
        console.log('Stories loaded:', data);
        this.stories = data;
        // e.g., chunk size 8 => each slide can hold up to 8 items
        this.chunkedStories = this.chunkArray(this.stories, 8);
      },
      error: (err) => {
        console.error('Error loading stories:', err);
      }
    });
  }

  // Helper to chunk an array into sub-arrays
  chunkArray(arr: any[], chunkSize: number): any[][] {
    const result = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      result.push(arr.slice(i, i + chunkSize));
    }
    return result;
  }

  toggleCreateStory(): void {
    this.showCreateStory = !this.showCreateStory;
    console.log('showCreateStory:', this.showCreateStory);
  }

  onStoryFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.selectedStoryFile = target.files[0];
      console.log('Story file selected:', this.selectedStoryFile);
      
    }
  }

  createStory(): void {
    if (!this.selectedStoryFile) {
      console.error('No image selected for the story.');
      return;
    }
    const userIdStr = localStorage.getItem('userId');
    if (!userIdStr) {
      console.error('User is not logged in.');
      return;
    }
    const userId = parseInt(userIdStr, 10);

    const formData = new FormData();
    formData.append('file', this.selectedStoryFile, this.selectedStoryFile.name);
    formData.append('text', this.newStoryText);
    console.log('Creating story with:', { userId, formData });

    this.storyService.createStory(userId, formData).subscribe({
      next: (story) => {
        console.log('Story created:', story);
        // Insert new story at the start
        this.stories.unshift(story);
        // Re-chunk the updated array
        this.chunkedStories = this.chunkArray(this.stories, 8);
        this.newStoryText = '';
        this.selectedStoryFile = null;
        this.showCreateStory = false;
      },
      error: (err) => {
        console.error('Error creating story:', err);
      }
    });
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.selectedFiles = Array.from(target.files);
      console.log('Selected files:', this.selectedFiles);
    }
  }

  get selectedFileNames(): string {
    return this.selectedFiles && this.selectedFiles.length
      ? this.selectedFiles.map(f => f.name).join(', ')
      : '';
  }
  get selectedStoryFileNames(): string {
    return this.selectedStoryFile ? this.selectedStoryFile.name : '';
  }
  

  createPost(): void {
    if (!this.newPostContent.trim() && (!this.selectedFiles || this.selectedFiles.length === 0)) {
      return;
    }
    const newPost: Post = {
      id: 0,
      title: '',
      content: this.newPostContent,
      postType: this.newPostType,
      date: new Date(),
      user: undefined
    };

    const formData = new FormData();
    const normalizedPostType = this.newPostType.toString().trim().toUpperCase().replace(/ /g, '_');
    formData.append('content', newPost.content);
    formData.append('postType', normalizedPostType);
    this.selectedFiles.forEach(file => {
      formData.append('files', file, file.name);
    });

    this.postService.createPost(newPost, formData).subscribe(post => {
      this.posts.unshift(post);
      this.originalPosts.unshift(post);
      this.newPostContent = '';
      this.selectedFiles = [];
      this.newPostType = PostType.GENERAL;
      this.updatePosts();
    });
  }

  updatePosts(): void {
    let filtered = this.originalPosts;
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(post =>
        post.content.toLowerCase().includes(query) ||
        (post.user && post.user.name.toLowerCase().includes(query))
      );
    }
    if (this.selectedPostType) {
      const selectedType = this.selectedPostType.toUpperCase().replace(/ /g, '_');
      filtered = filtered.filter(post =>
        post.postType &&
        post.postType.toUpperCase().replace(/ /g, '_') === selectedType
      );
    }
    this.posts = filtered;
  }

  filterByType(type: PostType): void {
    this.selectedPostType = type;
    this.updatePosts();
  }

  clearTypeFilter(): void {
    this.selectedPostType = null;
    this.updatePosts();
  }
  scrollStories(direction: 'left' | 'right'): void {
    const container = document.querySelector('.stories-slide');
    if (container) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }
  
}

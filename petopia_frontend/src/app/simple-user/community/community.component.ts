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

  // For delete confirmation modal
  showDeleteConfirmation: boolean = false;
  storyToDeleteId: number | null = null;

  // For story popup viewer
  activeStory: Story | null = null;
  popupTimeout: any; // to store the setTimeout reference

  
  // For story popup viewer:
  activeStoryIndex: number = -1; // index into stories array; -1 means no active popup
  progress: number = 0;          // progress bar percentage (0 to 100)
  popupTimer: any;               // reference for the interval timer

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
        // Chunk stories if needed (e.g., for a carousel)
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
        // Insert the new story at the start
        this.stories.unshift(story);
        // Re-chunk the updated array if needed
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

  // Return the selected story file name
  get selectedStoryFileNames(): string {
    return this.selectedStoryFile ? this.selectedStoryFile.name : '';
  }

  // Methods for post creation (unchanged)
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

  // ---------- Delete Confirmation Methods ----------

  // Check whether the current user is the owner of the story
  isOwner(story: Story): boolean {
    const currentUserId = Number(localStorage.getItem('userId'));
    return story.user && story.user.id_user === currentUserId;
  }

  openDeleteConfirmation(storyId: number): void {
    // Prevent the parent click event (if any) by stopping propagation in HTML
    this.storyToDeleteId = storyId;
    this.showDeleteConfirmation = true;
  }

  cancelDelete(): void {
    this.showDeleteConfirmation = false;
    this.storyToDeleteId = null;
  }

  confirmDelete(): void {
    if (this.storyToDeleteId !== null) {
      this.storyService.deleteStory(this.storyToDeleteId).subscribe(() => {
        // Remove the story from the list
        this.stories = this.stories.filter(s => s.id !== this.storyToDeleteId);
        this.chunkedStories = this.chunkArray(this.stories, 8);
        this.cancelDelete();
      }, error => {
        console.error('Error deleting story:', error);
        this.cancelDelete();
      });
    }
  }

    // Called when a story card is clicked to show the story popup


     // Returns the active story object (or null if none)
  getActiveStory(): Story | null {
    if (this.activeStoryIndex >= 0 && this.activeStoryIndex < this.stories.length) {
      return this.stories[this.activeStoryIndex];
    }
    return null;
  }

  // Opens the story popup for a given index (called from (click) on story card)
  openStoryPopup(index: number): void {
    // Clear any existing popup timer if running
    if (this.popupTimer) {
      clearInterval(this.popupTimer);
    }
    this.activeStoryIndex = index;
    this.progress = 0;
    this.startProgressTimer();
  }

  // Starts the progress timer (5 seconds total, update every 50ms)
  startProgressTimer(): void {
    const totalDuration = 5000; // 5 seconds
    const updateInterval = 50;  // update every 50ms
    const updatesCount = totalDuration / updateInterval;  // e.g., 5000/50 = 100 updates
    const increment = 100 / updatesCount; // progress increment per update
    this.popupTimer = setInterval(() => {
      this.progress += increment;
      if (this.progress >= 100) {
        // Auto-navigate to next story when timer completes.
        this.nextStory();
      }
    }, updateInterval);
  }

  // Closes the popup and clears the timer
  closeStoryPopup(): void {
    this.activeStoryIndex = -1;
    this.progress = 0;
    if (this.popupTimer) {
      clearInterval(this.popupTimer);
    }
  }

  // Navigates to the next story if available
  nextStory(event?: Event): void {
    if (event) {
      event.stopPropagation(); // prevent closing the popup when clicking arrow
    }
    if (this.popupTimer) {
      clearInterval(this.popupTimer);
    }
    // If at last story, close popup; otherwise, go to next
    if (this.activeStoryIndex < this.stories.length - 1) {
      this.activeStoryIndex++;
      this.progress = 0;
      this.startProgressTimer();
    } else {
      this.closeStoryPopup();
    }
  }

  // Navigates to the previous story if available
  prevStory(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    if (this.popupTimer) {
      clearInterval(this.popupTimer);
    }
    if (this.activeStoryIndex > 0) {
      this.activeStoryIndex--;
      this.progress = 0;
      this.startProgressTimer();
    } else {
      // Optionally, you can loop to the last story or just do nothing.
      // this.activeStoryIndex = this.stories.length - 1; // loop back
      // this.progress = 0; this.startProgressTimer();
      this.closeStoryPopup();
    }
  }

  // ... existing methods (toggleCreateStory, createStory, etc.)

  // Example: Click handler on a story card (pass its index)
  onStoryCardClick(index: number): void {
    this.openStoryPopup(index);
  }

}

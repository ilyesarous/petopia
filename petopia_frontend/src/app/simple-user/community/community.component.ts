import { Component, OnInit } from '@angular/core';
import { Post, PostType } from '../../models/community/post';
import { PostService } from '../../services/community/post.service';
import { StoryService } from '../../services/community/story.service';
import { Story } from '../../models/community/story';

@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.css']
})
export class CommunityComponent implements OnInit {
  posts: Post[] = [];
  originalPosts: Post[] = [];
  stories: Story[] = [];

  newPostContent: string = '';
  selectedFiles: File[] = [];
  newPostType: PostType = PostType.GENERAL;
  PostType = PostType;

  // Variables de filtrage
  searchQuery: string = '';
  postTypes = Object.values(PostType);
  selectedPostType: PostType | null = null;

  constructor(private postService: PostService, private storyService: StoryService) {}

  ngOnInit(): void {
    this.loadPosts();
    this.loadStories();
  }

  loadPosts(): void {
    this.postService.getPosts().subscribe(data => {
      // Trier les posts du plus récent au plus ancien
      this.originalPosts = data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      this.posts = this.originalPosts;
    });
  }

  loadStories(): void {
    this.storyService.getStories().subscribe(data => {
      this.stories = data;
    });
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.selectedFiles = Array.from(target.files);
      console.log('Selected files:', this.selectedFiles);
    }
  }

  // Getter pour afficher les noms des fichiers sélectionnés
  get selectedFileNames(): string {
    return this.selectedFiles && this.selectedFiles.length
      ? this.selectedFiles.map(f => f.name).join(', ')
      : '';
  }

  createPost(): void {
    if (!this.newPostContent.trim() && (!this.selectedFiles || this.selectedFiles.length === 0)) {
      return; // Empêche la création de posts vides
    }
    const newPost: Post = {
      id: 0, // sera défini par le backend
      title: '',
      content: this.newPostContent,
      postType: this.newPostType,
      date: new Date(),
      user: undefined,
    };

    const formData = new FormData();
    const normalizedPostType = this.newPostType.toString().trim().toUpperCase().replace(/ /g, '_');
    formData.append('content', newPost.content);
    formData.append('postType', normalizedPostType);
    this.selectedFiles.forEach(file => {
      formData.append('files', file, file.name);
    });

    this.postService.createPost(newPost, formData).subscribe(post => {
      // Ajoute le nouveau post en haut de la liste
      this.posts.unshift(post);
      this.originalPosts.unshift(post);
      // Réinitialise le formulaire
      this.newPostContent = '';
      this.selectedFiles = [];
      this.newPostType = PostType.GENERAL;
      // On met à jour le filtrage en cas d'un filtre actif
      this.updatePosts();
    });
  }

  // Mise à jour du filtrage en combinant la recherche et le filtre par type
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
      // Normaliser la valeur sélectionnée en remplaçant les espaces par des underscores
      const selectedType = this.selectedPostType.toUpperCase().replace(/ /g, '_');
      filtered = filtered.filter(post => 
        post.postType &&
        post.postType.toUpperCase().replace(/ /g, '_') === selectedType
      );
    }
    this.posts = filtered;
  }
  

  // Méthode appelée lors de la sélection d'un type
  filterByType(type: PostType): void {
    this.selectedPostType = type;
    this.updatePosts();
  }

  // Réinitialiser le filtre par type
  clearTypeFilter(): void {
    this.selectedPostType = null;
    this.updatePosts();
  }
}

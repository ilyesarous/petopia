import { Component, OnInit } from '@angular/core';
import { News } from 'src/app/models/community/news';
import { NewsService } from 'src/app/services/community/news.service';
import { PostService } from 'src/app/services/community/post.service';
import { Router } from '@angular/router';
import { Post, PostType } from 'src/app/models/community/post';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {
  newsList: News[] = [];
  paginatedNews: News[] = [];
  loading = true;

  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalPages: number = 0;

  constructor(
    private newsService: NewsService,
    private postService: PostService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.newsService.getAllNews().subscribe({
      next: (data) => {
        this.newsList = data.reverse();
        this.totalPages = Math.ceil(this.newsList.length / this.itemsPerPage);
        this.changePage(1);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  changePage(page: number): void {
    this.currentPage = page;
    const start = (page - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedNews = this.newsList.slice(start, end);
  }

  shareAsPost(news: News): void {
    const post: Post = {
      id: 0,
      title: news.title,
      content: `${news.description}\n\nRead more: ${news.url}`,
      postType: PostType.NEWS,
      image: news.imageUrl,
      date: new Date(),
      user: undefined
    };

    const formData = new FormData();
    formData.append('content', post.content);
    formData.append('postType', PostType.NEWS.toUpperCase());
    formData.append('image', post.image!);

    this.postService.createPost(post, formData).subscribe({
      next: () => this.router.navigate(['/community']),
      error: (err) => console.error('❌ Error sharing post with image URL:', err)
    });
  }
}

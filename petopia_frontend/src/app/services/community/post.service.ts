import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from '../../models/community/post';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  // Nouvelle URL de base tenant compte du port 8082 et du contexte /petopia
  private baseUrl = 'http://petopia.local:31158/petopia/posts';

  constructor(private http: HttpClient) {}

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.baseUrl}/getAll`);
  }
  createPost(post: Post, formData: FormData): Observable<Post> {
    return this.http.post<Post>(`${this.baseUrl}/add`, formData);
  }
  

  getPostById(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.baseUrl}/${id}`);
  }

  updatePost(postId: number, formData: FormData): Observable<Post> {
    return this.http.put<Post>(`${this.baseUrl}/update/${postId}`, formData);
  }
  

  deletePost(id: number): Observable<string> {
    return this.http.delete(`${this.baseUrl}/delete/${id}`, { responseType: 'text' });
  }
  
}

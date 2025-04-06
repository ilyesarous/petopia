import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from '../../models/community/post';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  // Nouvelle URL de base tenant compte du port 8082 et du contexte /petopia
  private baseUrl = 'http://localhost:8082/petopia/posts';

  constructor(private http: HttpClient) {}

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.baseUrl}/getAll`);
  }

  // createPost(post: Post, file: File): Observable<Post> {
  //   const formData = new FormData();
  //   formData.append('file', file);
  //   formData.append('content', post.content);
  //   return this.http.post<Post>(`${this.baseUrl}/add`, formData);
  // }
  createPost(post: Post, formData: FormData): Observable<Post> {
    return this.http.post<Post>(`${this.baseUrl}/add`, formData);
  }
  

  getPostById(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.baseUrl}/${id}`);
  }

  updatePost(id: number, postDetails: Post): Observable<Post> {
    return this.http.put<Post>(`${this.baseUrl}/update/${id}`, postDetails);
  }

  deletePost(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${id}`);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from '../../models/community/comment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  // The full URL to your backend API
  private baseUrl = 'http://spring-service:7000/petopia/comments';

  constructor(private http: HttpClient) {}

  getCommentsByPost(postId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.baseUrl}/post/${postId}`);
  }

  getAllComments(): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.baseUrl}/all`); // adjust URL as per your backend
  }
  getCommentById(id: number): Observable<Comment> {
    return this.http.get<Comment>(`${this.baseUrl}/${id}`);
  }



  addComment(userId: number, postId: number, content: string): Observable<Comment> {
    const formData = new FormData();
    formData.append('userId', userId.toString());
    formData.append('postId', postId.toString());
    formData.append('content', content);
    return this.http.post<Comment>(`${this.baseUrl}/add`, formData);
  }
  deleteComment(commentId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${commentId}`);
  }
  updateComment(commentId: number, content: string): Observable<Comment> {
    // Send JSON body with the updated content
    return this.http.put<Comment>(`${this.baseUrl}/update/${commentId}`, { content });
  }
}

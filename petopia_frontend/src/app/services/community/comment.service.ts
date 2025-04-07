import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from '../../models/community/comment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  // Le chemin complet vers l'API backend
  private baseUrl = 'http://localhost:8082/petopia/comments';

  constructor(private http: HttpClient) {}

  getCommentsByPost(postId: number): Observable<Comment[]> {
    // Vous pouvez adapter l'endpoint selon vos besoins (ici exemple général)
    return this.http.get<Comment[]>(`${this.baseUrl}/all?postId=${postId}`);
  }

  addComment(userId: number, postId: number, content: string): Observable<Comment> {
    return this.http.post<Comment>(`${this.baseUrl}/add?userId=${userId}&postId=${postId}`, content);
  }
}

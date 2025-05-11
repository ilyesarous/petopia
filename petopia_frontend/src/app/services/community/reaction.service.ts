import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reaction } from '../../models/community/reaction';

@Injectable({
  providedIn: 'root'
})
export class ReactionService {
  private baseUrl = 'http://petopia.local:31158/petopia/reactions';

  constructor(private http: HttpClient) {}

  addReaction(postId: number, type: string): Observable<Reaction> {
    const formData = new FormData();
    formData.append('postId', postId.toString());
    formData.append('type', type);
    return this.http.post<Reaction>(`${this.baseUrl}/add`, formData);
  }

  updateReaction(reactionId: number, type: string): Observable<Reaction> {
    return this.http.put<Reaction>(`${this.baseUrl}/update/${reactionId}?type=${type}`, null);
  }

  removeReaction(reactionId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/remove/${reactionId}`);
  }

  getReactionsByPost(postId: number): Observable<Reaction[]> {
    return this.http.get<Reaction[]>(`${this.baseUrl}/post/${postId}`);
  }
  getAllReactions(): Observable<Reaction[]> {
    return this.http.get<Reaction[]>(`${this.baseUrl}/all`);
  }
  getReactionById(id: number): Observable<Reaction> {
    return this.http.get<Reaction>(`${this.baseUrl}/${id}`);
  }
  
}

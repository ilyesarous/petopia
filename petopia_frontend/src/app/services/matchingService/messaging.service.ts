import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ChatMessage } from 'src/app/models/matching/chat-message';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {
  private apiUrl = 'http://spring-service:7000/petopia/user/matches';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getMessagesForMatch(matchId: number): Observable<ChatMessage[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<ChatMessage[]>(`${this.apiUrl}/messages/${matchId}`, { headers }).pipe(
      tap(messages => console.log(`Fetched ${messages.length} messages for match ${matchId}`, messages)),
      catchError(error => {
        console.error('Error fetching messages for match', matchId, error);
        return throwError(error);
      })
    );
  }
}

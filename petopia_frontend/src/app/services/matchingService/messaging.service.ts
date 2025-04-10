// src/app/services/matchingService/messaging.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// Export the ChatMessage interface
export interface ChatMessage {
  id?: number;
  matchId: number;
  senderId: number;
  receiverId: number;
  content: string;
  type: string; // You can refine this to 'CHAT' | 'LEAVE' | 'CONNECTION' if desired
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class MessagingService {
  private apiUrl = 'http://localhost:8082/petopia/user/matches'; // Updated to correct port

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
    return this.http.get<ChatMessage[]>(`${this.apiUrl}/messages/${matchId}`, { headers });
  }
}
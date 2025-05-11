// src/app/services/blocked-user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReqRes } from 'src/app/models/matching/ReqRes';

@Injectable({
  providedIn: 'root'
})
export class BlockedUserService {
  private apiUrl = 'http://petopia.local:31158/petopia/api/blocked-users';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  blockUser(blockerId: number, blockedId: number): Observable<ReqRes> {
    return this.http.post<ReqRes>(`${this.apiUrl}/block/${blockerId}/${blockedId}`, {}, { headers: this.getHeaders() });
  }

  unblockUser(blockerId: number, blockedId: number): Observable<ReqRes> {
    return this.http.post<ReqRes>(`${this.apiUrl}/unblock/${blockerId}/${blockedId}`, {}, { headers: this.getHeaders() });
  }

  getBlockedUsers(userId: number): Observable<ReqRes> {
    return this.http.get<ReqRes>(`${this.apiUrl}/${userId}`, { headers: this.getHeaders() });
  }
}
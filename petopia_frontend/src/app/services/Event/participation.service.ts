import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Participation } from 'src/app/models/EventModule/participation';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParticipationService {
  private baseUrl = 'http://localhost:8082/petopia/user/participations';

  constructor(private http: HttpClient) {}
  
    // Token d'authentification
  token: string = localStorage.getItem('token') || '';
  
    private getAuthHeaders(): HttpHeaders {
      return new HttpHeaders({
        // 'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
      });
    }

  getAllParticipations(): Observable<Participation[]> {
    return this.http.get<Participation[]>(`${this.baseUrl}/getAllParticipations`);
  }

  getParticipationById(id: number): Observable<Participation> {
    return this.http.get<Participation>(`${this.baseUrl}/display/${id}`);
  }

  addParticipation(participation: Participation): Observable<Participation> {
    return this.http.post<Participation>(`${this.baseUrl}/addParticipation`, participation, {
      headers: this.getAuthHeaders()
    });
  }

  updateParticipation(id: number, participation: Participation): Observable<Participation> {
    return this.http.put<Participation>(`${this.baseUrl}/updateParticipation/${id}`, participation);
  }

  deleteParticipation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/deletParticipation/${id}`);
  }
}

// src/app/services/matchingService/matches.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Match} from 'src/app/models/matching/match';

@Injectable({
  providedIn: 'root'
})
export class MatchsService {
  private apiUrl = 'http://localhost:8082/petopia';
  private staticToken = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqaWhlZGpvb0BnbWFpbC5jb20iLCJyb2xlcyI6WyJST0xFX1VTRVIiXSwidXNlcklkIjoyLCJ1c2VybmFtZSI6ImppaGVkam9vQGdtYWlsLmNvbSIsImlhdCI6MTc0MzY0MTM5OSwiZXhwIjoxNzQzNzI3Nzk5fQ.YkFQqGW9KZRLLvD6S_nuqs9EndHWOfTXOAxtxa5W--c';

  constructor(private http: HttpClient) {}

  // Méthode privée pour générer les headers avec le token
  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.staticToken}`
    });
  }

  // Récupérer les matchs en attente
    getPendingMatches(): Observable<Match[]> {
      const headers = this.getAuthHeaders();
      console.log('Headers pour getPendingMatches:', headers.get('Authorization'));
      return this.http.get<Match[]>(`${this.apiUrl}/user/matches/pending`, { headers });
    }

 // Accepter un match
  acceptMatch(matchId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    console.log('Headers pour acceptMatch:', headers.get('Authorization'));
    return this.http.post(`${this.apiUrl}/user/matches/accept/${matchId}`, {}, { headers });
  }

  // Créer un match (déplacé depuis PetService)
  createMatch(pet1Id: number, pet2Id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    const body = { pet1Id, pet2Id };
    const url = `${this.apiUrl}/user/matches/create`;
    console.log('Envoi de la requête vers:', url);
    console.log('Headers pour createMatch:', headers.get('Authorization'));
    return this.http.post<any>(url, body, { headers });
  }

  // Supprimer un match
  deleteMatch(matchId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    console.log('Headers pour deleteMatch:', headers.get('Authorization'));
    return this.http.delete(`${this.apiUrl}/user/matches/deleteMatches/${matchId}`, { headers });
  }
}
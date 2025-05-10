// src/app/services/matchingService/matchs.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Match } from 'src/app/models/matching/match';
import { FriendWithPets } from 'src/app/models/matching/friend-with-pets';

@Injectable({
  providedIn: 'root'
})
export class MatchsService {
  private apiUrl = 'http://spring-service:7000/petopia';
  private staticToken = localStorage.getItem('token');

  constructor(private http: HttpClient) {}

  // Méthode privée pour générer les headers avec le token
  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.staticToken}`
    });
  }

  // Récupérer tous les matchs
  getAllMatches(): Observable<Match[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Match[]>(`${this.apiUrl}/user/matches/getAll`, { headers });
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

  // Créer un match
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

  //Récupérer la liste des amis (matchs acceptés)
  getAcceptedFriends(): Observable<any[]> {
    const headers = this.getAuthHeaders();
    // Correction de l'URL : supprimer l'espace avant "/user/matches/friends"
    return this.http.get<any[]>(`${this.apiUrl}/user/matches/friends`, { headers });
  }

 /* getAcceptedFriends(): Observable<FriendWithPets[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<FriendWithPets[]>(`${this.apiUrl}/user/matches/friends`,{ headers });
  }*/
}

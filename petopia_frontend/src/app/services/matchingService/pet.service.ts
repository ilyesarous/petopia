import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PetService {
  private apiUrl = 'http://localhost:8082/petopia';
  private staticToken = localStorage.getItem('token');

  constructor(private http: HttpClient) {}

  // Méthode privée pour générer les headers avec le token



private getAuthHeaders(): HttpHeaders {
  const token = localStorage.getItem('token');
  console.log('Token brut depuis localStorage:', token);
  const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
  });
  console.log('En-tête Authorization envoyé:', headers.get('Authorization'));
  return headers;
}

  getPetsByOwnerId(ownerId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    console.log('Headers pour getPetsByOwnerId:', headers.get('Authorization'));
    return this.http.get(`${this.apiUrl}/pet/owner/${ownerId}`, { headers });
  }

  checkPetPreferences(petId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    console.log('Headers pour checkPetPreferences:', headers.get('Authorization'));
    return this.http.get(`${this.apiUrl}/user/pet/${petId}/check-preferences`, { headers });
  }

  getMatchingPets(petId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    console.log('Headers pour getMatchingPets:', headers.get('Authorization'));
    return this.http.get(`${this.apiUrl}/user/pet/${petId}/matching-pets`, { headers });
  }

  addPreferences(preferences: any): Observable<any> {
    const headers = this.getAuthHeaders();
    console.log('Headers pour addPreferences:', headers.get('Authorization'));
    return this.http.post(`${this.apiUrl}/user/preferences/addPreferences`, preferences, { headers });
  }


  getPetById(petId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    console.log('Headers for getPetById:', headers.get('Authorization'));
    // Update the URL to match the backend endpoint
    return this.http.get<any>(`${this.apiUrl}/pet/get/${petId}`, { headers });
  }

  getPetsByStatus(status: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/pet/status/${status}`, { headers });
  }

  getPreferencesByPetId(petId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}/user/preferences/getByPetId/${petId}`, { headers });
  }

  deletePreferences(idPreferences: number): Observable<void> {
    const headers = this.getAuthHeaders();
    console.log('Delete Request - Headers:', headers.get('Authorization'));
    console.log('Delete Request - URL:', `${this.apiUrl}/user/preferences/deletePreferences/${idPreferences}`);
    return this.http.delete<void>(`${this.apiUrl}/user/preferences/deletePreferences/${idPreferences}`, { headers });
}

// New method for filtered pets
getPetsByStatusWithBlockFilter(status: string, userId: number): Observable<any[]> {
  const headers = this.getAuthHeaders();
  return this.http.get<any[]>(`${this.apiUrl}/status/${status}/filtered?userId=${userId}`, { headers });
}


}

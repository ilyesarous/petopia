import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PetService {

  private apiUrl = 'http://localhost:888/user/pet';
  private apiUrlAdmin = 'http://localhost:888/admin/pet';
  private apiUrll = 'http://localhost:888/pet';

  constructor(private http: HttpClient) { }

  addPet(pet: any): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in localStorage');
      return new Observable();
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(`${this.apiUrl}/add`, pet, { headers });
  }

  getAllPets(): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in localStorage');
      return new Observable();
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.get(`${this.apiUrl}/all`, { headers });
  }
  deletePet(petId: number): Observable<any> {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found in localStorage');
            return new Observable();
        }

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });

        return this.http.delete(`${this.apiUrll}/delete/${petId}`, { headers });
    }
}

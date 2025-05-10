import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PetService {

  private apiUrl = 'http://spring-service:7000/petopia/user/pet';
  private apiUrlAdmin = 'http://spring-service:7000/petopia/admin/pet';
  private apiUrll = 'http://spring-service:7000/petopia/pet';
  private apiowner = 'http://spring-service:7000/petopia/pet/owner'

  constructor(private http: HttpClient) { }

  addPet(petData: any, imageFile: File): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError('No token found');
    }

    const formData = new FormData();
    formData.append('petImage', imageFile);
    formData.append('petData', new Blob([JSON.stringify(petData)], {
      type: 'application/json'
    }));

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(`${this.apiUrl}/add`, formData, { headers });
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

    return this.http.get(`${this.apiUrll}/all`, { headers });
  }

  getpetByID(idR: number): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in localStorage');
      return new Observable();
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.get(`${this.apiowner}/${idR}`, { headers });
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

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Shelter } from 'src/app/models/adoption/shelter/Shelter';
@Injectable({
  providedIn: 'root'
})
export class ShelterService {
  private apiUrl = 'http://localhost:8082/petopia/shelters';
 
  

    constructor(private http: HttpClient) {}
    createShelter(shelter: Shelter): Observable<Shelter> {
      return this.http.post<Shelter>(`${this.apiUrl}/addShelter`, shelter);
    }
  
    updateShelter(shelter: Shelter): Observable<Shelter> {
      return this.http.put<Shelter>(`${this.apiUrl}/updateShelter/${shelter.id_shelter}`, shelter);
    }
  
    deleteShelter(id: number): Observable<string> {
      return this.http.delete<string>(`${this.apiUrl}/deleteShelter/${id}`);
    }
  
    getShelterById(id: number): Observable<Shelter> {
      return this.http.get<Shelter>(`${this.apiUrl}/getShelter/${id}`);
    }
  
    getAllShelters(): Observable<Shelter[]> {
      return this.http.get<Shelter[]>(`${this.apiUrl}/getAllShelters`);
    }
  
    getShelterByUserId(userId: number): Observable<Shelter> {
      return this.http.get<Shelter>(`${this.apiUrl}/user/${userId}`);
    }
  }
  


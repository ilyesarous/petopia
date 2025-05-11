import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Shelter } from 'src/app/models/adoption/shelter/Shelter';
@Injectable({
  providedIn: 'root'
})
export class ShelterService {
  private apiUrl = 'http://petopia.local:31158/petopia/shelters';
 
  

    constructor(private http: HttpClient) {}

    createShelter(shelter: Shelter, logoFile: File | null): Observable<Shelter> {
      const formData = new FormData();
      formData.append('shelter', JSON.stringify(shelter)); 
      if (logoFile) {
        formData.append('logoFile', logoFile, logoFile.name);
      }
  
      const headers = new HttpHeaders();
  
      return this.http.post<Shelter>(`${this.apiUrl}/addShelter`, formData, { headers });
    }
  
    updateShelter(shelter: Shelter, logoFile: File | null): Observable<Shelter> {
      const formData = new FormData();
      formData.append('shelter', JSON.stringify(shelter)); 
      if (logoFile) {
        formData.append('logoFile', logoFile, logoFile.name);
      }
  
      const headers = new HttpHeaders();
  
      return this.http.put<Shelter>(`${this.apiUrl}/updateShelter/${shelter.id_shelter}`, formData, { headers });
    }
  
    deleteShelter(id: number): Observable<string> {
      return this.http.delete(`${this.apiUrl}/deleteShelter/${id}`, {
        responseType: 'text'
      });
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
  


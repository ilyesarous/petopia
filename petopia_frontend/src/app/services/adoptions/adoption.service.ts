import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Adoption } from 'src/app/models/adoption/adoption/Adoption';

@Injectable({
  providedIn: 'root'
})
export class AdoptionService {

  private apiUrl = 'http://localhost:8082/petopia/adoptions';

  constructor(private http: HttpClient) {}

  // Create an adoption request. Depending on your backend, you might send JSON or FormData.
  createAdoption(adoption: any): Observable<Adoption> {
    return this.http.post<Adoption>(`${this.apiUrl}/addAdoption`, adoption);
  }

  updateAdoption(id: number, adoption: Adoption): Observable<Adoption> {
    return this.http.put<Adoption>(`${this.apiUrl}/updateAdoption/${id}`, adoption);
  }

  deleteAdoption(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteAdoption/${id}`);
  }

  getAdoptionById(id: number): Observable<Adoption> {
    return this.http.get<Adoption>(`${this.apiUrl}/getAdoption/${id}`);
  }

  getAllAdoptions(): Observable<Adoption[]> {
    return this.http.get<Adoption[]>(`${this.apiUrl}/getAllAdoptions`);
  }

  getAdoptionsByRequesterId(requesterId: number): Observable<Adoption[]> {
    return this.http.get<Adoption[]>(`${this.apiUrl}/requester/${requesterId}`);
  }

  getAdoptionsByShelterId(shelterId: number): Observable<Adoption[]> {
    return this.http.get<Adoption[]>(`${this.apiUrl}/shelter/${shelterId}`);
  }

  getAdoptionsByStatus(status: string): Observable<Adoption[]> {
    return this.http.get<Adoption[]>(`${this.apiUrl}/status/${status}`);
  }

  getAdoptionsByPetId(petId: number): Observable<Adoption[]> {
    return this.http.get<Adoption[]>(`${this.apiUrl}/pet/${petId}`);
  }
}
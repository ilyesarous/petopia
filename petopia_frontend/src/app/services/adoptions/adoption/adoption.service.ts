import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Adoption } from 'src/app/models/adoption/adoption/Adoption';

@Injectable({
  providedIn: 'root'
})
export class AdoptionService {

  private apiUrl = 'http://spring-service:7000/petopia/adoptions';

  constructor(private http: HttpClient) {}

  createAdoption(adoptionData: any, cinImage: File): Observable<Adoption> {
    const formData = new FormData();
    formData.append('cinImage', cinImage);
    formData.append('adoptionData', JSON.stringify(adoptionData));

    return this.http.post<Adoption>(`${this.apiUrl}/addAdoption`, formData);
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

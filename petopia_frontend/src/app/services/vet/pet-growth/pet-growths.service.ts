import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PetGrowth } from 'src/app/models/vet/pet-growth';

@Injectable({
  providedIn: 'root'
})
export class PetGrowthsService {

  private apiUrl = 'http://localhost:8082/petopia/auth/PetGrowth';

  constructor(private http: HttpClient) { }

  getAllPetGrowths(): Observable<PetGrowth[]> {
    return this.http.get<PetGrowth[]>(`${this.apiUrl}/retrieveAllPetGrowths`);
  }

  getPetGrowthById(idPet_Growth: number): Observable<PetGrowth> {
    return this.http.get<PetGrowth>(`${this.apiUrl}/retrievePetGrowth/${idPet_Growth}`);
  }

  getPetGrowthsByPetId(petId: number): Observable<PetGrowth[]> {
    return this.http.get<PetGrowth[]>(`${this.apiUrl}/retrievePetGrowthsByPetId/${petId}`);
  }

  addPetGrowth(growth: any): Observable<PetGrowth> {
    return this.http.post<PetGrowth>(`${this.apiUrl}/addPetGrowth`, growth);
  }

  updatePetGrowth(id: number, growth: any): Observable<PetGrowth> {
    return this.http.put<PetGrowth>(`${this.apiUrl}/updatePetGrowth/${id}`, growth);
  }

  deletePetGrowth(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deletePetGrowth/${id}`);
  }

  calculateBMI(petId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/calculateBMI/${petId}`);
  }

}

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

}

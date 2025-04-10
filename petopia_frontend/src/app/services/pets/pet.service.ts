import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pet } from 'src/app/models/pet/Pet';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PetService {

  private apiUrl = 'http://localhost:8082/petopia';

  constructor(private http: HttpClient) {}

  // Add a pet from the user perspective
  addPet(pet: Pet): Observable<Pet> {
    return this.http.post<Pet>(`${this.apiUrl}/user/pet/add`, pet);
  }

  // Add a pet from the shelter perspective

  addPetForShelter(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/shelter/pet/add`, formData);
  }
  // Update pet (for shelters)

  updatePetWithImage(id: number, formData: FormData): Observable<Pet> {
    return this.http.put<Pet>(`${this.apiUrl}/pet/updateWithImage/${id}`, formData);
  }
  


  // Delete pet (for shelters)
  deletePet(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/pet/delete/${id}`);
  }

  // Get pet by id
  getPetById(id: number): Observable<Pet> {
    return this.http.get<Pet>(`${this.apiUrl}/pet/get/${id}`);
  }

  // Get pets by shelter id
  getPetsByShelterId(shelterId: number): Observable<Pet[]> {
    return this.http.get<Pet[]>(`${this.apiUrl}/pet/shelter/${shelterId}`);
  }

  // Get pets by owner id
  getPetsByOwnerId(ownerId: number): Observable<Pet[]> {
    return this.http.get<Pet[]>(`${this.apiUrl}/pet/owner/${ownerId}`);
  }

  // Get pets by status
  getPetsByStatus(status: string): Observable<Pet[]> {
    return this.http.get<Pet[]>(`${this.apiUrl}/pet/status/${status}`);
  }

  getUnassignedPets(userId: number): Observable<Pet[]> {
    return this.http.get<Pet[]>(`${this.apiUrl}/pet/unassigned?userId=${userId}`);
  }
  
}

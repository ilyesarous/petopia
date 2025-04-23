import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VetLocationService {

  private apiUrl = 'http://localhost:8082/petopia/auth/api/vet-locations';

  constructor(private http: HttpClient) { }

  saveLocation(location: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/save`, location);
  }

  getLocationsByVet(vetId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/vet/${vetId}`);
  }

  getAllLocations(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getAllLocation`);
  }

  deleteLocation(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }

}

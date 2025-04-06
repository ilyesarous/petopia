import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Diagnosis } from 'src/app/models/vet/diagnosis';

@Injectable({
  providedIn: 'root'
})
export class DiagnosisService {

  private apiUrl = 'http://localhost:8082/petopia/auth/Diagnosis';

  constructor(private http: HttpClient) { }

  getAllDiagnosis(): Observable<Diagnosis[]> {
    return this.http.get<Diagnosis[]>(`${this.apiUrl}/retrieveAllDiagnosis`);
  }

  getDiagnosisById(idDiagnosis: number): Observable<Diagnosis> {
    return this.http.get<Diagnosis>(`${this.apiUrl}/retrieveDiagnosis/${idDiagnosis}`);
  }

  getDiagnosisByPetId(petId: number): Observable<Diagnosis[]> {
      return this.http.get<Diagnosis[]>(`${this.apiUrl}/retrieveDiagnosisByPetId/${petId}`);
  }

addDiagnosis(diagnosis: any): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/addDiagnosis`, diagnosis, {
    headers: { 'Content-Type': 'application/json' }
  });
}

updateDiagnosis(diagnosis: any): Observable<any> {
  return this.http.put<any>(`${this.apiUrl}/updateDiagnosis`, diagnosis, {
    headers: { 'Content-Type': 'application/json' }
  });
}
  
  deleteDiagnosis(idDiagnosis: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteDiagnosis/${idDiagnosis}`);
  }

}

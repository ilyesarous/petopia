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

}

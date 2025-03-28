import { Injectable } from '@angular/core';
//import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Consultation } from 'src/app/models/vet/consultation';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConsultationService {

  private apiUrl = 'http://localhost:8082/petopia/auth/Consultations';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }),
    withCredentials: true // Important pour les requêtes avec credentials
  };

  constructor(private http: HttpClient) { }

  getAllConsultations(): Observable<Consultation[]> {
    return this.http.get<Consultation[]>(`${this.apiUrl}/retriveAllConsultations`);
  }

  getConsultationById(idConsultation: number): Observable<Consultation> {
    return this.http.get<Consultation>(`${this.apiUrl}/retriveConsultations/${idConsultation}`);
  }

  updateConsultationStatus(id: number, status: string): Observable<any> {
    return this.http.patch(
      `${this.apiUrl}/updateConsultationsStatus/${id}`, 
      { statusT: status },
      this.httpOptions
    );
  }

}

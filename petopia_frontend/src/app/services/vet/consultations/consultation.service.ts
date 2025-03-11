import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Consultation } from 'src/app/models/vet/consultation';

@Injectable({
  providedIn: 'root'
})
export class ConsultationService {

  private apiUrl = 'http://localhost:8082/petopia/auth/Consultations';

  constructor(private http: HttpClient) { }

  getAllConsultations(): Observable<Consultation[]> {
    return this.http.get<Consultation[]>(`${this.apiUrl}/retriveAllConsultations`);
  }

  getConsultationById(idConsultation: number): Observable<Consultation> {
    return this.http.get<Consultation>(`${this.apiUrl}/retriveConsultations/${idConsultation}`);
  }

}

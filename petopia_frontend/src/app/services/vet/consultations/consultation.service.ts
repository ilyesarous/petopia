import { Injectable } from '@angular/core';
//import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Consultation } from 'src/app/models/vet/consultation';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Pet} from "src/app/models/pet/Pet";

@Injectable({
  providedIn: 'root'
})
export class ConsultationService {

  private apiUrl = 'http://spring-service:7000/petopia/auth/Consultations';

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
    return this.http.put(
      `${this.apiUrl}/updateConsultationsStatus/${id}`,
      { statusT: status },
      this.httpOptions
    );
  }

  addConsultation(consultation: any): Observable<Consultation> {
    return this.http.post<Consultation>(`${this.apiUrl}/addConsultations`, consultation, this.httpOptions);
  }

  deleteConsultation(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteConsultations/${id}`, this.httpOptions);
  }

  getUniquePetsForVet(vetId: number): Observable<Pet[]> {
    return this.http.get<Pet[]>(`${this.apiUrl}/vet/${vetId}/pets`, this.httpOptions);
  }

  getConsultationsByUserId(userId: number): Observable<Consultation[]> {
    return this.http.get<Consultation[]>(`${this.apiUrl}/retrieveConsultationsByUser/${userId}`, this.httpOptions);
  }

}

import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ReclamationService {

  private apiUrl = 'http://spring-service:7000/petopia/reclamation';

  constructor(private http: HttpClient) { }

  addReclamation(reclamation: any): Observable<any> {
    const token = localStorage.getItem('token');
    console.log(token);
    if (!token) {
      console.error('No token found in localStorage');
      return new Observable();
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(`${this.apiUrl}/add`,reclamation, { headers });
  }

  getAllReclamations(): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in localStorage');
      return new Observable();
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.get(`${this.apiUrl}/reclamations`, { headers });
  }

  getReclamationByID(idR: number): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in localStorage');
      return new Observable();
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.get(`${this.apiUrl}/get/${idR}`, { headers });
  }

  updateReclamationDescription(userId: number, reclamationId: number, description: string): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in localStorage');
      return new Observable();
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    const body = { description };
    return this.http.put(`${this.apiUrl}/update-description/${userId}/${reclamationId}`, body, { headers });
  }

  deleteReclamation(reclamationId: number): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in localStorage');
      return new Observable();
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.delete(`${this.apiUrl}/delete/${reclamationId}`, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error.error);
      })
    );
  }

  getStats(): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in localStorage');
      return new Observable();
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any>(`${this.apiUrl}/stats`, { headers });
  }

  respondToReclamation(reclamationId: number, response: string, newStatus?: string): Observable<any> {
    const body: { adminResponse: string, newStatus?: string } = {
      adminResponse: response,
    };
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in localStorage');
      return new Observable();
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    // Only include newStatus in the body if it has a value
    if (newStatus) {
      body.newStatus = newStatus;
    }

    return this.http.post(`${this.apiUrl}/respond/${reclamationId}`, body,{ headers }).pipe(
      catchError(error => {
        console.error('Error responding to reclamation:', error);
        return throwError(error);
      })
    );
  }
}

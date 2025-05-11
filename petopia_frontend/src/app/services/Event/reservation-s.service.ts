// src/app/services/Event/reservation.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { Reservation } from 'src/app/models/EventModule/reservation';


@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private apiUrl = 'http://petopia.local:31158/petopia/user/ReservationServiceAnimal';



// Token d'authentification
  token: string = localStorage.getItem('token') || '';
  
  private getAuthHeaders(): HttpHeaders {
    this.token = localStorage.getItem('token') || ''; // Refresh token from storage
    console.log('Current token:', this.token);
    
    if (!this.token) {
      console.error('No token found in localStorage');
      // Redirect to login or handle missing token
      this.router.navigate(['/login']); // You'll need to inject Router
      throw new Error('Authentication required');
    }
    
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`,
    });
  }


  constructor(private http: HttpClient,
              private router: Router
  ) { }

  bookService(serviceId: number, userId: number, date?: Date): Observable<any> {
    const requestBody = date ? { dateReservation: date } : null;
    
    return this.http.post(
      `${this.apiUrl}/book/${serviceId}?userId=${userId}`,
      requestBody,
      { headers: this.getAuthHeaders() }
    );
  }

 
 
  getUserReservations(userId: number): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(
      `${this.apiUrl}/getAllReservations`,
      { headers: this.getAuthHeaders() }
    ).pipe(
      map((reservations: Reservation[]) => reservations.filter(r => r.utilisateur.id_user === userId))
    );
  }

deleteReservation(id: number): Observable<void> {
  return this.http.delete<void>(
    `${this.apiUrl}/deleteReservation/${id}`,
    { headers: this.getAuthHeaders() }
  );
}
}
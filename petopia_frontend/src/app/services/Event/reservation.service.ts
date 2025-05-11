// src/app/services/Event/reservation.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reservation } from 'src/app/models/EventModule/reservation';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private apiUrl = 'http://petopia.local:31158/petopia/user/ReservationServiceAnimal';

  constructor(private http: HttpClient, private router: Router) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      // 'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    });
  }

  createReservation(reservation: Reservation): Observable<Reservation> {
    return this.http.post<Reservation>(`${this.apiUrl}/addReservation`, reservation, {
      headers: this.getAuthHeaders()
    });
  }

  getUserReservations(userId: number): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/user/${userId}`, {
      headers: this.getAuthHeaders()
    });
  }

  getServiceReservations(serviceId: number): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.apiUrl}/service/${serviceId}`, {
      headers: this.getAuthHeaders()
    });
  }

  cancelReservation(reservationId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteReservation/${reservationId}`, {
      headers: this.getAuthHeaders()
    });
  }
}
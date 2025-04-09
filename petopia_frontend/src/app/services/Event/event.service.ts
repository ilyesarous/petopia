import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Event } from 'src/app/models/EventModule/appevent'; // Assurez-vous que le chemin est correct


@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://localhost:8082/petopia/events'; 


  private eventsSubject = new BehaviorSubject<any[]>([]);  // État partagé des événements
  events$ = this.eventsSubject.asObservable();  // Observable public
  
  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

    // Récupérer tous les événements
    getEvents(): Observable<any[]> {
      return this.http.get<any[]>(`${this.apiUrl}/getEtudiants`, { headers: this.getAuthHeaders() });
    }
  

  // Récupérer un événement par ID
  getEventById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/display/${id}`,{ headers: this.getAuthHeaders()});
  }

  // Ajouter un événement
  addEvent(event: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/addEvent`, event, { headers: this.getAuthHeaders() }).pipe(
      tap(() => this.loadEvents())  // Recharger les événements après l'ajout
    );
  }

  // Recharger la liste des événements
  loadEvents() {
    this.getEvents().subscribe(events => {
      this.eventsSubject.next(events);  // Mettre à jour les événements dans le BehaviorSubject
    });
  }

  // Mettre à jour un événement
  updateEvent(id: number, event: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/updateEvent/${id}`, event, { headers: this.getAuthHeaders() }).pipe(
      tap(() => this.loadEvents())  // Recharger les événements après la mise à jour
    );
  }


  // Supprimer un événement
  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteEvent/${id}` , { headers: this.getAuthHeaders() });
  }


}

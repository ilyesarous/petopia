import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Event } from 'src/app/models/EventModule/appevent'; // Assurez-vous que le chemin est correct


@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://spring-service:7000/petopia/events';


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
  // updateEvent(id: number, event: any): Observable<any> {
  //   return this.http.put<any>(`${this.apiUrl}/updateEvent/${id}`, event, { headers: this.getAuthHeaders() }).pipe(
  //     tap(() => this.loadEvents())  // Recharger les événements après la mise à jour
  //   );
  // }
// In EventService
updateEvent(id: number, event: any): Observable<any> {
  return this.http.put<any>(`${this.apiUrl}/updateEvent/${id}`, event, {
    headers: this.getAuthHeaders()
  }).pipe(
    tap(updatedEvent => {
      // Update the BehaviorSubject
      const currentEvents = this.eventsSubject.value;
      const index = currentEvents.findIndex(e => e.idEvent === id);
      if (index !== -1) {
        currentEvents[index] = updatedEvent;
        this.eventsSubject.next([...currentEvents]); // New array reference
      }
    })
  );
}

  // Supprimer un événement
  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteEvent/${id}` , { headers: this.getAuthHeaders() });
  }


// Dans event.service.ts
decrementPlaces(idEvent: number): Observable<any> {
  return this.http.put<any>(`${this.apiUrl}/decrementPlaces/${idEvent}`, null, {
    headers: this.getAuthHeaders()
  }).pipe(
    tap(updatedEvent => {
      const currentEvents = this.eventsSubject.value;
      const index = currentEvents.findIndex(e => e.idEvent === idEvent);
      if (index !== -1) {
        currentEvents[index] = updatedEvent;
        this.eventsSubject.next([...currentEvents]);
      }
    })
  );
}





filterEvents(filters: any): Observable<Event[]> {
  let params = new HttpParams();

  if (filters.name) params = params.append('name', filters.name);
  if (filters.lieu) params = params.append('lieu', filters.lieu);
  if (filters.startDate) params = params.append('startDate', filters.startDate.toISOString());
  if (filters.endDate) params = params.append('endDate', filters.endDate.toISOString());
  if (filters.eventType) params = params.append('eventType', filters.eventType);
  if (filters.status) params = params.append('status', filters.status);
  if (filters.minPrice) params = params.append('minPrice', filters.minPrice.toString());
  if (filters.maxPrice) params = params.append('maxPrice', filters.maxPrice.toString());

  return this.http.get<Event[]>(`${this.apiUrl}/filter`, {
    headers: this.getAuthHeaders(),
    params
  }).pipe(
    tap(events => this.eventsSubject.next(events))
  );
}
}

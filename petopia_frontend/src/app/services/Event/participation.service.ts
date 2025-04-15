import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Participation } from 'src/app/models/EventModule/participation';
import { Observable } from 'rxjs';
import { catchError,map } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParticipationService {
  private baseUrl = 'http://localhost:8082/petopia/participations';

  constructor(private http: HttpClient) {}
  
    // Token d'authentification
  token: string = localStorage.getItem('token') || '';
  
    private getAuthHeaders(): HttpHeaders {
      return new HttpHeaders({
        // 'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
      });
    }

  getAllParticipations(): Observable<Participation[]> {
    return this.http.get<Participation[]>(`${this.baseUrl}/getAllParticipations`, {
      headers: this.getAuthHeaders()});
  }

  getParticipationById(id: number): Observable<Participation[]> {
    // console.log("***************"+id);
    
    return this.http.get<Participation[]>(`${this.baseUrl}/display/${id}`, {
      headers: this.getAuthHeaders()});
  }

  getParticipationEventById(eventId: number): Observable<Participation[]> {
    return this.http.get<Participation[]>(
      `${this.baseUrl}/displayPartiByEvent/${eventId}`, 
      { headers: this.getAuthHeaders() }
    ).pipe(
      catchError(error => {
        console.error('Error fetching participations:', error);
        return of([]); // Retourne un tableau vide en cas d'erreur
      })
    );
  }


  addParticipation(participation: Participation): Observable<Participation> {
    return this.http.post<Participation>(`${this.baseUrl}/addParticipation`, participation, {
      headers: this.getAuthHeaders()
    });
  }

  updateParticipation(id: number, participation: Participation): Observable<Participation> {
    return this.http.put<Participation>(`${this.baseUrl}/updateParticipation/${id}`, participation, {
      headers: this.getAuthHeaders()});
  }

  deleteParticipation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/deletParticipation/${id}`, {
      headers: this.getAuthHeaders()});
  }
  checkUserParticipation(userId: number, eventId: number): Observable<boolean> {
    return this.http.get<boolean>(
      `${this.baseUrl}/check-participation/${userId}/${eventId}`,
      { headers: this.getAuthHeaders() }
    ).pipe(
      catchError(error => {
        if (error.status === 403) {
          // Token expiré ou invalide
          console.error('Accès refusé - Token peut-être expiré');
          // Vous pourriez déclencher une déconnexion ici
        }
        return of(false); // Retourne false en cas d'erreur
      })
    );
  }
  // Méthode pour récupérer le temps restant
getTimeRemaining(participationId: number): Observable<number> {
  return this.http.get<number>(
      `${this.baseUrl}/time-remaining/${participationId}`,
      { headers: this.getAuthHeaders() }
  );
}


  // // Modifiez la méthode addParticipation pour retourner la participation avec le temps restant
  // addParticipation(participation: Participation): Observable<Participation> {
  //   return this.http.post<Participation>(
  //     `${this.baseUrl}/addParticipation`, 
  //     participation, 
  //     { headers: this.getAuthHeaders() }
  //   ).pipe(
  //     map((response: any) => { // Added type annotation here
  //       // Calculer le temps restant si nécessaire
  //       if (response.event && response.event.dateDebut) {
  //         const eventDate = new Date(response.event.dateDebut).getTime();
  //         const now = new Date().getTime();
  //         response.timeRemaining = eventDate - now;
  //       }
  //       return response;
  //     })
  //   );
  // }

 
}


import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RatingVet } from 'src/app/models/vet/rating-vet';

@Injectable({
  providedIn: 'root'
})
export class VetRatingService {
  private apiUrl = 'http://spring-service:7000/petopia/auth/ratingVet';

  constructor(private http: HttpClient) { }

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Cache-Control': 'no-cache'
      }),
      withCredentials: true
    };
  }

  addRatingVet(rating: RatingVet): Observable<RatingVet> {
    // Validation du token
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    return this.http.post<RatingVet>(
      `${this.apiUrl}/addRatingVet`,
      rating,
      this.getAuthHeaders()
    );
  }

  deleteRatingVet(idRatingVet: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/deleteRatingVet/${idRatingVet}`,
      this.getAuthHeaders()
    );
  }

  getAllRatings(): Observable<RatingVet[]> {
    return this.http.get<RatingVet[]>(
      `${this.apiUrl}/retriveAllRatingVet`,
      this.getAuthHeaders()
    );
  }

  getRatingById(idRatingVet: number): Observable<RatingVet> {
    return this.http.get<RatingVet>(
      `${this.apiUrl}/retriveRatingVet/${idRatingVet}`,
      this.getAuthHeaders()
    );
  }

  getRatingsByUserId(userId: number): Observable<RatingVet[]> {
    return this.http.get<RatingVet[]>(
      `${this.apiUrl}/retrieveRatingVetByUser/${userId}`,
      this.getAuthHeaders()
    );
  }

  getAverageRatingForVet(userId: number): Observable<number> {
    return new Observable(observer => {
      this.getRatingsByUserId(userId).subscribe({
        next: ratings => {
          if (ratings.length === 0) {
            observer.next(0);
          } else {
            const sum = ratings.reduce((acc, rating) => acc + (rating.note || 0), 0);
            const average = sum / ratings.length;
            observer.next(average);
          }
          observer.complete();
        },
        error: err => observer.error(err)
      });
    });
  }
}

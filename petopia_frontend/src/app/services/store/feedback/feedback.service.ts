import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Feedback } from 'src/app/models/product/feedback';

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
  constructor(private http: HttpClient) {}
  private url = 'http://localhost:8082/petopia/user/feedback';
  token: string = localStorage.getItem('token') || '';

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
  }
  create(feedback: Feedback) {
    return this.http.post(
      `${this.url}/add/${+feedback.user_id}/${+feedback.productId}`,
      feedback,
      {
        headers: this.getAuthHeaders(),
        responseType: 'text',
      }
    );
  }
  getByProductId(productId: number): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(`${this.url}/getByProduct/${productId}`, {
      headers: this.getAuthHeaders(),
    });
  }
}

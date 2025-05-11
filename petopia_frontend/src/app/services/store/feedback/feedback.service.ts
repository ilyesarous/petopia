import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Feedback } from 'src/app/models/product/feedback';

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
  constructor(private http: HttpClient) {}
  private url = 'http://petopia.local:31158/petopia/user/feedback';
  private url1 = 'http://petopia.local:31158/petopia/partner/feedback';
  token: string = localStorage.getItem('token') || '';
  userId = localStorage.getItem('userId')
    ? parseInt(localStorage.getItem('userId')!)
    : 0;

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
  }
  create(feedback: Feedback) {
    return this.http.post(
      `${this.url}/add/${this.userId}/${+feedback.productId}`,
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

  getSentimentByProduct(idProduct: number): Observable<string>{
    return this.http.get(`${this.url1}/sentiment/${idProduct}`,
      {
        headers: this.getAuthHeaders(),
        responseType: 'text',
      }
    )
  }

  deleteFeedback(feedbackId: number): Observable<any> {
    return this.http.delete(`${this.url}/delete/${feedbackId}`, {
      headers: this.getAuthHeaders(),
    });
  }

}

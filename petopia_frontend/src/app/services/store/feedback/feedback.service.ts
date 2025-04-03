import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Feedback } from 'src/app/models/product/feedback';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(private http: HttpClient) { }
  private url = 'http://localhost:8082/petopia/auth/feedback';

  create(feedback: Feedback) {
    return this.http.post(`${this.url}/add/${+feedback.productId}`, feedback, {
      responseType: 'text'  // This tells Angular to expect text, not JSON
    });
  }
  getByProductId(productId: number) : Observable<Feedback[]> {
    return this.http.get<Feedback[]>(`${this.url}/getByProduct/${productId}`);
  }
}

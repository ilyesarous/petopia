import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GeminiService {
  private baseUrl = 'http://localhost:8082/petopia/ai';

  constructor(private http: HttpClient) {}

  generatePost(topic: string): Observable<string> {
    return this.http.post(this.baseUrl + '/generate', topic, {
      responseType: 'text',
    });
  }
}

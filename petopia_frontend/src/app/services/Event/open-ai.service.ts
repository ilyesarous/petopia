// src/app/services/openai.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OpenAIService {
  private apiUrl = 'http://localhost:8082/petopia/api/openai/suggest-event';

  constructor(private http: HttpClient) { }

  suggestEventForPet(petDescription: string): Observable<string> {
    return this.http.post(this.apiUrl, { petDescription }, { responseType: 'text' as const });
  }

  // Add to openai.service.ts
generatePetAd(serviceRequest: string): Observable<string> {
  return this.http.post(
    'http://localhost:8082/petopia/api/openai/generate-ad',
    { serviceRequest },
    { responseType: 'text' as const }
  );
}
generateEventImage(eventDescription: string): Observable<string> {
  return this.http.post(
    'http://localhost:8082/petopia/api/openai/generate-event-image',
    { eventDescription },
    { 
      responseType: 'text' as const,
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
  );
}

}
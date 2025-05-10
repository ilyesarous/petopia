// translation.service.ts
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private translateUrl = 'http://spring-service:7000/petopia/translate';

  constructor(private http: HttpClient) {}

  translate(text: string, targetLang: string = 'en'): Observable<any> {
    const params = new URLSearchParams();
    params.set('text', text);
    params.set('target', targetLang);

    return this.http.get(this.translateUrl + `?text=${encodeURIComponent(text)}&target=${targetLang}`, {
      responseType: 'text'
    });
      }

}


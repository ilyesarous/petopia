import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { News } from 'src/app/models/community/news';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private baseUrl = 'http://spring-service:7000/petopia/news';

  constructor(private http: HttpClient) {}

  getAllNews(): Observable<News[]> {
    return this.http.get<News[]>(this.baseUrl);
  }

  triggerScraping(): Observable<News[]> {
    return this.http.post<News[]>(`${this.baseUrl}/scrape`, {});
  }
}

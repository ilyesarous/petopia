import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Story } from '../../models/community/story';

@Injectable({
  providedIn: 'root'
})
export class StoryService {
  private baseUrl = 'http://spring-service:7000/petopia/stories';

  constructor(private http: HttpClient) {}

  getStories(): Observable<Story[]> {
    return this.http.get<Story[]>(`${this.baseUrl}/all`);
  }

  // createStory(userId: number, story: Story): Observable<Story> {
  //   return this.http.post<Story>(`${this.baseUrl}/add/${userId}`, story);
  // }
  createStory(userId: number, formData: FormData): Observable<Story> {
    return this.http.post<Story>(`${this.baseUrl}/add/${userId}`, formData);
  }


  getStoryById(id: number): Observable<Story> {
    return this.http.get<Story>(`${this.baseUrl}/${id}`);
  }

  updateStory(id: number, story: Story): Observable<Story> {
    return this.http.put<Story>(`${this.baseUrl}/update/${id}`, story);
  }

  deleteStory(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${id}`);
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageGenerationService {
  private apiUrl = 'http://localhost:5002/api';

  constructor(private http: HttpClient) {}

  generateImage(description: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/generate-image`, { description });
  }
  recommendSimilarPetsFromImage(desc: string) {
    return this.http.post<{ matches: any[] }>(
      `${this.apiUrl}/recommendations`,
      { description: desc }
    );
  }
  generateBabyPet(petId1: string, petId2: string): Observable<{ image_url: string }> {
    const body = {
      pet_id_1: petId1,
      pet_id_2: petId2
    };

    return this.http.post<{ image_url: string }>(`${this.apiUrl}/generate-baby-pet`, body);
  }
  storeImageDescription(imageUrl: string, imageId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/description`, {
      image_url: imageUrl,
      image_id: imageId
    });
  }
  detectBreedFromImage(base64: string) {
    return this.http.post<{ result: string }>(
      `${this.apiUrl}/detect-breed`,
      { image_base64: base64 }
    );
  }
  checkPostContent(text: string) {
    return this.http.post<{ status: string }>(
     `${this.apiUrl}/moderate-text`,
      { text }
    );
  }
  generatePost(topic: string) {
    return this.http.post<{ postSuggestion: string }>(
      `${this.apiUrl}/generate-post`,
      { topic }
    );
  }



}

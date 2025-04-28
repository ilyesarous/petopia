import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdsService {
  constructor(private http: HttpClient) {}

  url: string = 'http://localhost:8082/petopia/admin/ads';
  url1: string = 'http://localhost:8082/petopia/user/ads';

  token: string = localStorage.getItem('token') || '';
  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
  }

  getAllAds(): Observable<any> {
    return this.http.get(this.url, {
      headers: this.getAuthHeaders(),
    });
  }
  getAllAdsUser(): Observable<any> {
    return this.http.get(this.url1, {
      headers: this.getAuthHeaders(),
    });
  }
  addAds(formData: FormData): Observable<any> {
    return this.http.post(this.url+"/add", formData, {
      headers: this.getAuthHeaders(),
    });
  }

  
  deleteAd(id: number){
    return this.http.delete(this.url+"/delete/"+id, {
      headers: this.getAuthHeaders()
    })
  }
}

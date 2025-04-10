import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiUrl = 'http://localhost:8082/petopia/partner/dashboard';

  constructor(private http: HttpClient) {}

  getPartnerDashboardStats(partnerId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats/${partnerId}`);
  }
}

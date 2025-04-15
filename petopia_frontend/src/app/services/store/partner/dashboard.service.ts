import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from 'src/app/models/product/Product';


interface stats {
  totalProducts: number,
  averageRating: number,
  totalSales: number,
  totalRevenue: number,
  topSellingProducts: Product[],
  topSellingProductsId: number[]
  listTotalByProduct: number[]
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiUrl = 'http://localhost:8082/petopia/partner/dashboard';
  token: string = localStorage.getItem('token') || '';
    private getAuthHeaders(): HttpHeaders {
      return new HttpHeaders({
        Authorization: `Bearer ${this.token}`,
      });
    }

  constructor(private http: HttpClient) {}

  getDashboardData(idUser: number): Observable<stats> {
    return this.http.get<stats>(`${this.apiUrl}/${idUser}`, {
      headers: this.getAuthHeaders(),
    });
  }

}

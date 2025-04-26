import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BrandsService {

  constructor(private http: HttpClient) {}
  
    url: string = 'http://localhost:8082/petopia/admin/brand';
    url1: string = 'http://localhost:8082/petopia/partner/brand';
    url2: string = 'http://localhost:8082/petopia/user/brand';
  
    token: string = localStorage.getItem('token') || '';
    private getAuthHeaders(): HttpHeaders {
      return new HttpHeaders({
        Authorization: `Bearer ${this.token}`,
      });
    }
    getAllBrands(): Observable<any>{
      return this.http.get(this.url);
    }
    getAllBrandsPartner(): Observable<any>{
      return this.http.get(this.url1);
    }
    getAllBrandsUser(): Observable<any>{
      return this.http.get(this.url2);
    }

    addBrand(formData: FormData): Observable<any>{
      return this.http.post(this.url+"/add", formData, {
        headers: this.getAuthHeaders()
      });
    }

    deleteBrand(id: number){
      return this.http.delete(this.url+"/delete/"+id, {
        headers: this.getAuthHeaders()
      })
    }

}

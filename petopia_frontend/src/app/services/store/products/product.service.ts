import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from 'src/app/models/product/Product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}
  url: string = 'http://localhost:8082/petopia/user/';
  url1: string = 'http://localhost:8082/petopia/partner/';

  token: string = localStorage.getItem('token') || '';
  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
  }

  getAllProducts(): Observable<[Product]> {
    return this.http.get<[Product]>(this.url + 'product', {
      headers: this.getAuthHeaders()});
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(this.url + 'product/' + id, {
      headers: this.getAuthHeaders()});
  }

  addProduct(formData: FormData): Observable<Product> {
    return this.http.post<Product>(this.url + 'product/add', formData, {
      headers: this.getAuthHeaders(),});
  }

  updateLikedProduct(idProduct: number): Observable<Product> {
    return this.http.put<Product>(
      this.url + 'product/update/' + idProduct,
      idProduct,
      { headers: this.getAuthHeaders() }
    );
  }
  updateProduct(formData: FormData): Observable<Product> {
    return this.http.put<Product>(
      this.url + 'product/update',
      formData,
      { headers: this.getAuthHeaders() }
    );
  }

  getProductImageUrl(imagePath: string): string {
    if (!imagePath) return 'assets/images/store/product/placeholder.png';
    // If it's already a full URL (from assets)
    if (imagePath.startsWith('assets/')) {
      return imagePath;
    }
    // If it's just a filename
    return `assets/images/store/product/${imagePath}`;
  }

  getProductByPartnerId(id: number): Observable<Product[]> {
    return this.http.get<Product[]>(this.url1 + 'product/' + id, {
      headers: this.getAuthHeaders(),
    });
  }
}

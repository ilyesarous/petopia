import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from 'src/app/models/product/Product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}
  url: string = 'http://localhost:8082/petopia/auth/';

  getAllProducts(): Observable<[Product]> {
    return this.http.get<[Product]>(this.url + 'product');
  }
  
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(this.url + 'product/' + id);
  }

  addProduct(formData: FormData): Observable<Product> {
    return this.http.post<Product>(this.url + 'product/add', formData);
  }
  
  updateLikedProduct(idProduct: number): Observable<Product> {
    return this.http.put<Product>(
      this.url + 'product/update/' + idProduct,
      idProduct
    );
  }
  updateProduct(formData: FormData): Observable<Product> {
    return this.http.put<Product>(
      this.url + 'product/update',
      formData
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
}

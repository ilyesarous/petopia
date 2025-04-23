import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from 'src/app/models/product/Product';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  constructor(private http: HttpClient) {}
  url: string = 'http://localhost:8082/petopia/user/';
  token: string = localStorage.getItem('token') || '';

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token}`,
    });
  }

  // getNbItemsInCart(id_user: number): Observable<any> {
  //   return this.http.get<any>(this.url + 'cart/nbItems/' + id_user, {
  //     headers: this.getAuthHeaders(),
  //   });
  // }
  
  getCartByUserId(userId: number): Observable<any> {
    return this.http.get<any>(this.url + 'cart/' + userId, {
      headers: this.getAuthHeaders(),
    });
  }
  addToCart(
    id_user: number,
    idProduct: number,
    quantity: number
  ): Observable<any> {
    return this.http.post<any>(
      this.url + 'cart/add',
      { id_user, idProduct, quantity },
      {
        headers: this.getAuthHeaders(),
      }
    );
  }
  increaseQuantity(id_user: number, idProduct: number): Observable<any> {
    return this.http.put<any>(this.url + 'cart/increase', {id_user, idProduct}, {
      headers: this.getAuthHeaders(),
    });
  }
  decreaseQuantity(id_user: number, idProduct: number): Observable<any> {
    return this.http.put<any>(
      this.url + 'cart/decrease',
      { id_user, idProduct },
      {
        headers: this.getAuthHeaders(),
      }
    );
  }

  clearCart(id_user: number): Observable<any> {
    return this.http.delete<any>(this.url + 'cart/clear/' + id_user, {
      headers: this.getAuthHeaders(),
    });
  }
  removeItem(id_user: number, idProduct: number): Observable<any> {
    return this.http.delete<any>(this.url + 'cart/delete/' + id_user + '/' + idProduct, {
      headers: this.getAuthHeaders(),
    });
  }

  checkout(id_user: number): Observable<any>{
    return this.http.delete<any>(this.url+ 'cart/checkout/'+ id_user, {
      headers: this.getAuthHeaders(),
    })
  }

}

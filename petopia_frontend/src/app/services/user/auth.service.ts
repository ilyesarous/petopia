import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({ // inject service in component to use it
  providedIn: 'root',
})

export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  isAuthenticated = this.isAuthenticatedSubject.asObservable();

  private usernameSubject = new BehaviorSubject<string>(localStorage.getItem('username') || '');
  username = this.usernameSubject.asObservable();

  private roleSubject = new BehaviorSubject<string>(localStorage.getItem('role') || '');
  role = this.roleSubject.asObservable();


  private baseUrl = 'http://petopia.local:31158/petopia/auth';
  private baseUrlAdmin = 'http://petopia.local:31158/petopia/user';
  private baseUrlAdmin1 = 'http://petopia.local:31158/petopia/admin';


  constructor(private http: HttpClient) {}

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, user);
  }

  login(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, user).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error.error);
      })
    );
  }

  getAllUsers(): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in localStorage');
      return new Observable();
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.get(`${this.baseUrlAdmin1}/get-all-users`, { headers });
  }

  getUserById(userId: number): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in localStorage');
      return new Observable();
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.get(`${this.baseUrlAdmin}/get-user/${userId}`, { headers });
  }


  getCurrentUserById(userId: number): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in localStorage');
      return new Observable();
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.get(`http://localhost:7000/petopia/user/get-user/${userId}`, { headers });
  }

  logout(): void {
    const token = localStorage.getItem('token');

    if (token) {
      this.http
        .post(
          `${this.baseUrl}/logout`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .subscribe({
          next: () => {
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            this.isAuthenticatedSubject.next(false);
            this.usernameSubject.next('');
          },
          error: (err) => {
            console.error('Logout error:', err);
          },
        });
    }
  }

  updateAuthStatus(status: boolean): void {
    this.isAuthenticatedSubject.next(status);
  }

  updateUsername(username: string): void {
    this.usernameSubject.next(username);
  }
  updateRole(role: string): void {
    this.roleSubject.next(role);
  }

  deleteUser(userId: number): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in localStorage');
      return new Observable();
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.delete(`${this.baseUrlAdmin1}/delete/${userId}`, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error.error);
      })
    );
  }

  updateUser(userId: number, body: any): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return new Observable();
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    console.log("check in the service updated user")
    console.log(body);
    return this.http.put(`${this.baseUrlAdmin}/update/${userId}`, body, { headers });
  }

  forgotPassword(phoneNumber: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/forgot-password`, { phoneNumber });
  }

  resetPassword(phoneNumber: string, verificationCode: string, newPassword: string): Observable<any> {
    const formData = new FormData();
    formData.append('phoneNumber', phoneNumber);
    formData.append('verificationCode', verificationCode);
    formData.append('newPassword', newPassword);
    console.log(newPassword);
    return this.http.post(`${this.baseUrl}/reset-password`, formData);
  }



  getAllVets(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.get(`${this.baseUrl}/vets`, { headers });
  }

  RetriveAllUsers(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.get(`${this.baseUrl}/retrive-All-users`, { headers });
  }


}

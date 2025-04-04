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


    private baseUrl = 'http://localhost:8082/petopia/auth';
    private baseUrlAdmin = 'http://localhost:8082/petopia/admin';

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

      return this.http.get(`${this.baseUrlAdmin}/get-all-users`, { headers });
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

      return this.http.delete(`${this.baseUrlAdmin}/delete/${userId}`, { headers }).pipe(
          catchError((error: HttpErrorResponse) => {
            return throwError(() => error.error);
          })
      );
    }

  }

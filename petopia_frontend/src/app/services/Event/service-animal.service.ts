// src/app/services/service-animal.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { ServiceAnimal } from 'src/app/models/EventModule/serviceAnimal'; // Adjust the import path as necessary
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root' // Makes the service available application-wide
})
export class ServiceAnimalService {
  private apiUrl = 'http://localhost:8082/petopia/user/ServiceAnimal';

    private serviceSubject = new BehaviorSubject<any[]>([]);  // État partagé des événements
  
  
  // Token d'authentification
  token: string = localStorage.getItem('token') || '';
  
  private getAuthHeaders(): HttpHeaders {
    this.token = localStorage.getItem('token') || ''; // Refresh token from storage
    console.log('Current token:', this.token);
    
    if (!this.token) {
      console.error('No token found in localStorage');
      // Redirect to login or handle missing token
      this.router.navigate(['/login']); // You'll need to inject Router
      throw new Error('Authentication required');
    }
    
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`,
    });
  }

  constructor(private http: HttpClient,
              private router: Router // Inject Router for navigation
  ) { }

  // Get all service animals
  getAllServiceAnimals(): Observable<ServiceAnimal[]> {
    return this.http.get<ServiceAnimal[]>(`${this.apiUrl}/getAllServiceAnimals`, {
      headers: this.getAuthHeaders()
    });
  }

  // Get a single service animal by ID
  getServiceAnimalById(id: number): Observable<ServiceAnimal> {
    return this.http.get<ServiceAnimal>(`${this.apiUrl}/display/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Create a new service animal
  createServiceAnimal(serviceAnimal: any): Observable<any> {
    return this.http.post<ServiceAnimal>(
      `${this.apiUrl}/addServiceAnimal`, serviceAnimal,  { headers: this.getAuthHeaders() }).pipe(
      tap(() => this.loadServiceAnimals()), // Reload service animals after creation
    
    );
  }


  loadServiceAnimals() {
    this.getAllServiceAnimals().subscribe(serviceAnimals => {
this.serviceSubject.next(serviceAnimals);});  // Update the service animals in the BehaviorSubject});
  }


  // Update an existing service animal
  updateServiceAnimal(id: number, serviceAnimal: ServiceAnimal): Observable<ServiceAnimal> {
    return this.http.put<ServiceAnimal>(
      `${this.apiUrl}/updateServiceAnimal/${id}`, 
      serviceAnimal, 
      {
        headers: this.getAuthHeaders()
      }
    );
  }

  // Delete a service animal
  deleteServiceAnimal(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/deletServiceAnimal/${id}`, 
      {
        headers: this.getAuthHeaders()
      }
    );
  }

  // Add error handling (optional but recommended)
  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);
    if (error.status === 403) {
      console.error('Forbidden - Possible token issue');
      // Consider redirecting to login or token refresh
    }
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }

}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArduinoServiceService {

  private baseUrl = 'http://localhost:8082/petopia/auth/api/arduino';
  private petDetectedSubject = new Subject<any>();

  constructor(private http: HttpClient, private router: Router) {}

  processCode(code: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/process-code/${code}`);
  }

  get petDetected$() {
    return this.petDetectedSubject.asObservable();
  }

  simulateCodeEntry(code: string) {
    this.processCode(code).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.petDetectedSubject.next(response);
          this.router.navigate([response.redirectUrl]);
        }
      },
      error: (err) => {
        console.error('Error processing code:', err);
      }
    });
  }

}

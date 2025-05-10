import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class QrCodeVetService {

  constructor(private http: HttpClient) {}

  getVetQrCode(vetId: number) {
    return this.http.get(`http://spring-service:7000/petopia/auth/api/vet/qrcode/${vetId}`, {
      responseType: 'blob'
    });
  }

}

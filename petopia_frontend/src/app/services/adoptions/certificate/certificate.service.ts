import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AdoptionCertificate } from 'src/app/models/adoption/adoption/AdoptionCertificate';

@Injectable({
  providedIn: 'root'
})
export class CertificateService {
    private apiUrl = 'http://localhost:8082/petopia/adoptionCertificates';
  
    constructor(private http: HttpClient) {}
  
    // Create a certificate and sign as shelter
    createCertificate(adoptionId: number, payload: {
      pet_id_pet: number,
      shelter_id_shelter: number,
      user_id_user: number
    }): Observable<any> {
      return this.http.post(`${this.apiUrl}/addAdoptionCertificates/${adoptionId}`, payload);
    }
    
    
    signAsShelter(certificateId: number, base64Signature: string): Observable<any> {
      return this.http.put(`${this.apiUrl}/shelterSignCertificate/${certificateId}`, {
        shelter_signature: base64Signature
      });
    }
    
    
    
  
    // User adds their signature to an existing certificate
    signAsUser(certificateId: number, base64Signature: string): Observable<AdoptionCertificate> {
      return this.http.put<AdoptionCertificate>(
        `${this.apiUrl}/userSignCertificate/${certificateId}`,
        { user_signature: base64Signature }
      );
    }
    
  
    // Get single certificate by its ID
    getCertificateById(id: number): Observable<AdoptionCertificate> {
      return this.http.get<AdoptionCertificate>(`${this.apiUrl}/getAdoptionCertificate/${id}`);
    }
  
    // Get all certificates for a user
    getCertificatesByUserId(userId: number): Observable<AdoptionCertificate[]> {
      return this.http.get<AdoptionCertificate[]>(`${this.apiUrl}/user/${userId}`);
    }
  
    // Get all certificates for a shelter
    getCertificatesByShelterId(shelterId: number): Observable<AdoptionCertificate[]> {
      return this.http.get<AdoptionCertificate[]>(`${this.apiUrl}/shelter/${shelterId}`);
    }
  
    // Download a PDF version of the certificate
    downloadCertificate(id: number): Observable<Blob> {
      return this.http.get(`${this.apiUrl}/certificate/download/${id}`, {
        responseType: 'blob'
      });
    }
    getCertificatePdf(id: number) {
      return this.http.get(`${this.apiUrl}/certificates/${id}/pdf`, {
        responseType: 'blob'
      });
    }
    
  }

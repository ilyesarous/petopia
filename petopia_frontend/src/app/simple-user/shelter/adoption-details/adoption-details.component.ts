import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdoptionService } from 'src/app/services/adoptions/adoption/adoption.service';
import { Adoption } from 'src/app/models/adoption/adoption/Adoption';
import { AdoptionCertificate } from 'src/app/models/adoption/adoption/AdoptionCertificate';
import { CertificateService } from 'src/app/services/adoptions/certificate/certificate.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-adoption-details',
  templateUrl: './adoption-details.component.html',
  styleUrls: ['./adoption-details.component.css']
})
export class AdoptionDetailsComponent implements OnInit {
  adoption?: Adoption;
  certificate?: AdoptionCertificate;
  certificatePdfUrl: SafeResourceUrl | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private adoptionService: AdoptionService,
    private certificateService: CertificateService,
    private sanitizer: DomSanitizer 

  ) {}

 
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.adoptionService.getAdoptionById(+id).subscribe({
        next: (data) => {
          this.adoption = data;
          if (data.status === 'APPROVED') {
            this.loadCertificate(data.id_request);
          }
        },
        error: (err) => console.error('Failed to load adoption details', err)
      });
    }
  }
  loadCertificate(adoptionId: number): void {
    this.certificateService.getCertificateByAdoptionId(adoptionId).subscribe({
      next: (cert) => {
        this.certificate = cert;
        this.fetchPdf(cert.id_certificate); 
      },
      error: (err) => console.warn('No certificate found for this adoption', err)
    });
  }
  
  fetchPdf(certId: number): void {
    this.certificateService.getCertificatePdf(certId).subscribe(blob => {
      const fileURL = URL.createObjectURL(blob);
      this.certificatePdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
    });
  }
  approveRequest(): void {
    if (!this.adoption) return;

    const updated = {
      ...this.adoption,
      status: 'APPROVED'
    };

    this.adoptionService.updateAdoption(this.adoption.id_request, updated).subscribe({
      next: () => {
        alert('Request approved!');
        this.router.navigate(['shelter/adoption-requests']); 
      },
      error: (err) => {
        console.error('Error approving request:', err);
        alert('Error approving request.');
      }
    });
  }

  rejectRequest(): void {
    if (!this.adoption) return;

    const updated = {
      ...this.adoption,
      status: 'REJECTED'
    };

    this.adoptionService.updateAdoption(this.adoption.id_request, updated).subscribe({
      next: () => {
        alert('Request rejected!');
        this.router.navigate(['shelter/adoption-requests']);
      },
      error: (err) => {
        console.error('Error rejecting request:', err);
        alert('Error rejecting request.');
      }
    });
  }
  goToCertificate(): void {
    if (this.certificate) {
      this.router.navigate(['/shelter/certificate', this.certificate.id_certificate]);
    }
  }
  
}

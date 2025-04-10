import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { AdoptionCertificate } from 'src/app/models/adoption/adoption/AdoptionCertificate';
import { CertificateService } from 'src/app/services/adoptions/certificate/certificate.service';
import { ShelterService } from 'src/app/services/adoptions/shelter/shelter.service';

@Component({
  selector: 'app-shelter-certificate-details',
  templateUrl: './shelter-certificate-details.component.html',
  styleUrls: ['./shelter-certificate-details.component.css']
})
export class ShelterCertificateDetailsComponent {

  certificate?: AdoptionCertificate;
  certificatePdfUrl: SafeResourceUrl | null = null;

  constructor(
    private route: ActivatedRoute,
    private certificateService: CertificateService,
    private sanitizer: DomSanitizer

  ) {}

  ngOnInit(): void {
    const certId = Number(this.route.snapshot.paramMap.get('id'));
    this.certificateService.getCertificateById(certId).subscribe({
      next: (cert) => this.certificate = cert,
      error: (err) => console.error('Error fetching certificate:', err)
    });
  }


 
 fetchPdf(certId: number): void {
    this.certificateService.getCertificatePdf(certId).subscribe(blob => {
      const fileURL = URL.createObjectURL(blob);
      this.certificatePdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
    });
  }

  viewAndDownloadPdf(certId: number): void {
    this.certificateService.getCertificatePdf(certId).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      this.certificatePdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'adoption-certificate.pdf';
      a.click();
    });
  }
}


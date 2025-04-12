import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CertificateService } from 'src/app/services/adoptions/certificate/certificate.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AdoptionCertificate } from 'src/app/models/adoption/adoption/AdoptionCertificate';

@Component({
  selector: 'app-user-view-certificate',
  templateUrl: './user-view-certificate.component.html',
  styleUrls: ['./user-view-certificate.component.css']
})
export class UserViewCertificateComponent implements OnInit {
  certificate?: AdoptionCertificate;
  certificatePdfUrl?: SafeResourceUrl;

  constructor(
    private route: ActivatedRoute,
    private certificateService: CertificateService,
    private sanitizer: DomSanitizer,
    private router: Router 
  ) {}
  
  goBackToRequests(): void {
    this.router.navigate(['/adoption/requests']);
  }
  ngOnInit(): void {
    const certId = Number(this.route.snapshot.paramMap.get('id'));
    this.certificateService.getCertificateById(certId).subscribe({
      next: (data) => {
        this.certificate = data;
        this.loadPdf(certId);
      },
      error: (err) => console.error('Failed to load certificate:', err)
    });
  }

  loadPdf(certId: number) {
    this.certificateService.getCertificatePdf(certId).subscribe(blob => {
      const fileURL = URL.createObjectURL(blob);
      this.certificatePdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
    });
  }

  downloadPdf(certId: number) {
    this.certificateService.downloadCertificate(certId).subscribe(blob => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'adoption-certificate.pdf';
      a.click();
    });
  }

  imageFromBase64(data?: string): string {
    return data ? 'data:image/png;base64,' + data : '';
  }
}

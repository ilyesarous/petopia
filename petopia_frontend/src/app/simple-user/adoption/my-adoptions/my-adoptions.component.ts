import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Adoption } from 'src/app/models/adoption/adoption/Adoption';
import { AdoptionCertificate } from 'src/app/models/adoption/adoption/AdoptionCertificate';
import { AdoptionService } from 'src/app/services/adoptions/adoption/adoption.service';
import { CertificateService } from 'src/app/services/adoptions/certificate/certificate.service';

@Component({
  selector: 'app-my-adoptions',
  templateUrl: './my-adoptions.component.html',
  styleUrls: ['./my-adoptions.component.css']
})
export class MyAdoptionsComponent {
  adoptionRequests: Adoption[] = [];
  filteredRequests: Adoption[] = [];
  certificatesMap: { [adoptionId: number]: AdoptionCertificate } = {};

  searchText: string = '';
  selectedStatus: string = '';
  userId: number = 0;

  // Pagination
  currentPage: number = 1;
  totalPages: number = 1;
  pageNumbers: number[] = [];
  requestsPerPage: number = 6;

  constructor(
    private adoptionService: AdoptionService,
    private certificateService: CertificateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const storedId = localStorage.getItem('userId');
    this.userId = storedId ? +storedId : 0;

    if (this.userId) {
      this.adoptionService.getAdoptionsByRequesterId(this.userId).subscribe({
        next: (data) => {
          this.adoptionRequests = data;
          this.applyFilter();
        },
        error: (err) => console.error('Failed to load adoption requests:', err)
      });
    }
  }

  applyFilter(): void {
    let result = this.adoptionRequests;
  
    const search = this.searchText.trim().toLowerCase();
  
    if (search) {
      result = result.filter((r) => {
        const petName = r.pet?.petName?.toLowerCase() || '';
        const requesterName = r.requester?.name?.toLowerCase() || '';
  
        const certificateInfo = this.certificatesMap[r.id_request];
        const hasCertificate = r.status === 'APPROVED' && certificateInfo;
        const isSearchForCertificate = search.includes('certificate');
  
        return (
          petName.includes(search) ||
          requesterName.includes(search) ||
          (isSearchForCertificate && hasCertificate)
        );
      });
    }
  
    if (this.selectedStatus) {
      if (this.selectedStatus === 'CERTIFICATES') {
        result = result.filter(r =>
          r.status === 'APPROVED' && !!this.certificatesMap[r.id_request]
        );
      } else {
        result = result.filter(r => r.status === this.selectedStatus);
      }
    }
    
  
    this.totalPages = Math.ceil(result.length / this.requestsPerPage);
    this.pageNumbers = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.currentPage = Math.min(this.currentPage, this.totalPages || 1);
  
    const start = (this.currentPage - 1) * this.requestsPerPage;
    const end = start + this.requestsPerPage;
    this.filteredRequests = result.slice(start, end);
  
    // Ensure certificates are fetched only for approved requests
    const approvedAdoptions = result.filter(r => r.status === 'APPROVED');
    approvedAdoptions.forEach((r) => {
      if (!this.certificatesMap[r.id_request]) {
        this.certificateService.getCertificateByAdoptionId(r.id_request).subscribe({
          next: (cert) => {
            this.certificatesMap[r.id_request] = cert;
          },
          error: () => {}
        });
      }
    });
  }
  

  clearStatus(): void {
    this.selectedStatus = '';
    this.applyFilter();
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.applyFilter();
    }
  }

  goToSignCertificate(certificateId: number): void {
    this.router.navigate(['/adoption/signCertificate', certificateId]);
  }

  goToViewCertificate(certificateId: number): void {
    this.router.navigate(['/adoption/certificate', certificateId]);
  }
}

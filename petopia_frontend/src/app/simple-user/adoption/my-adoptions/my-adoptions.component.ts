import { Component } from '@angular/core';
import { Adoption } from 'src/app/models/adoption/adoption/Adoption';
import { AdoptionService } from 'src/app/services/adoptions/adoption/adoption.service';


@Component({
  selector: 'app-my-adoptions',
  templateUrl: './my-adoptions.component.html',
  styleUrls: ['./my-adoptions.component.css']
})
export class MyAdoptionsComponent {
  adoptionRequests: Adoption[] = [];
  filteredRequests: Adoption[] = [];
  searchText: string = '';
  selectedStatus: string = '';
  userId: number = 0;

  // Pagination
  currentPage: number = 1;
  totalPages: number = 1;
  pageNumbers: number[] = [];
  requestsPerPage: number = 6;

  constructor(private adoptionService: AdoptionService) {}

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

    if (this.searchText.trim()) {
      const search = this.searchText.toLowerCase();
      result = result.filter(
        r =>
          r.pet?.petName?.toLowerCase().includes(search) ||
          r.requester?.name?.toLowerCase().includes(search)
      );
    }

    if (this.selectedStatus) {
      result = result.filter(r => r.status === this.selectedStatus);
    }

    this.totalPages = Math.ceil(result.length / this.requestsPerPage);
    this.pageNumbers = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.currentPage = Math.min(this.currentPage, this.totalPages || 1);

    const start = (this.currentPage - 1) * this.requestsPerPage;
    const end = start + this.requestsPerPage;
    this.filteredRequests = result.slice(start, end);
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

  goToDetails(id: number): void {
    // Navigate to the detailed view page
    console.log('Navigating to request ID:', id);
    // Add routing logic if needed
  }
}
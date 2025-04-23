import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ShelterService } from 'src/app/services/adoptions/shelter/shelter.service';

@Component({
  selector: 'app-shelter-list',
  templateUrl: './shelter-list.component.html',
  styleUrls: ['./shelter-list.component.css']
})
export class ShelterListComponent implements OnInit {
  shelters: any[] = [];
  filteredShelters: any[] = [];
  paginatedShelters: any[] = [];
  searchQuery: string = '';

  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 0;
  pageNumbers: number[] = [];

  showSuccessAlert: boolean = false;
  showErrorAlert: boolean = false;

  constructor(private shelterService: ShelterService, private router: Router) {}

  ngOnInit(): void {
    this.shelterService.getAllShelters().subscribe({
      next: (data) => {
        this.shelters = data;
        this.applyFilter();
      },
      error: (err) => console.error('Error fetching shelters:', err)
    });
  }

  applyFilter(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredShelters = this.shelters.filter(shelter =>
      (shelter.shelter_name?.toLowerCase().includes(query)) ||
      (shelter.email?.toLowerCase().includes(query)) ||
      (shelter.phone_number?.toLowerCase().includes(query)) ||
      (shelter.website?.toLowerCase().includes(query))
    );
    this.setupPagination();
  }

  setupPagination(): void {
    this.totalPages = Math.ceil(this.filteredShelters.length / this.pageSize);
    this.pageNumbers = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.changePage(1);
  }

  changePage(page: number): void {
    this.currentPage = page;
    const startIndex = (page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedShelters = this.filteredShelters.slice(startIndex, endIndex);
  }

  viewShelterDetails(id: number): void {
    this.router.navigate(['dashboard/shelters', id]);
  }

  deleteShelter(id: number): void {
    if (confirm('Are you sure you want to delete this shelter?')) {
      this.shelterService.deleteShelter(id).subscribe({
        next: () => {
          this.showSuccessAlert = true;
          this.shelters = this.shelters.filter(shelter => shelter.id_shelter !== id);
          this.applyFilter();

          setTimeout(() => {
            this.showSuccessAlert = false;
          }, 1000);
        },
        error: (err) => {
          console.error('Error deleting shelter:', err);
          this.showErrorAlert = true;

          setTimeout(() => {
            this.showErrorAlert = false;
          }, 1000);
        }
      });
    }
  }
}

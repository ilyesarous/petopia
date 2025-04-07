import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Adoption } from 'src/app/models/adoption/adoption/Adoption';
import { Shelter } from 'src/app/models/adoption/shelter/Shelter';
import { AdoptionService } from 'src/app/services/adoptions/adoption/adoption.service';
import { ShelterService } from 'src/app/services/adoptions/shelter/shelter.service';

@Component({
  selector: 'app-shelter-adoption-requests',
  templateUrl: './shelter-adoption-requests.component.html',
  styleUrls: ['./shelter-adoption-requests.component.css']
})
export class ShelterAdoptionRequestsComponent implements OnInit {
  allAdoptionRequests: Adoption[] = [];
  filteredRequests: Adoption[] = [];
  adoptionRequests: Adoption[] = []; // this will be paginated
  selectedStatus: string = 'PENDING';
  searchText: string = '';
  shelter?: Shelter;

  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 3;
  totalPages: number = 0;
  pageNumbers: number[] = [];

  constructor(
    private adoptionService: AdoptionService,
    private shelterService: ShelterService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userIdStr = localStorage.getItem('userId');
    if (!userIdStr) {
      console.error('No userId found in localStorage');
      return;
    }

    const userId = Number(userIdStr);

    this.shelterService.getShelterByUserId(userId).subscribe({
      next: (shelterData) => {
        this.shelter = shelterData;

        if (this.shelter.id_shelter) {
          this.adoptionService.getAdoptionsByShelterId(this.shelter.id_shelter).subscribe({
            next: (data) => {
              this.allAdoptionRequests = data;
              this.applyFilter(); // Filter and paginate
            },
            error: (err) => {
              console.error('Error fetching adoption requests:', err);
            }
          });
        }
      },
      error: (err) => {
        console.error('Error fetching shelter details:', err);
      }
    });
  }

  applyFilter(): void {
    this.filteredRequests = this.allAdoptionRequests.filter(req => {
      const matchesStatus = this.selectedStatus ? req.status === this.selectedStatus : true;
      const matchesSearch =
        this.searchText.trim() === '' ||
        req.requester.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
        req.pet.petName.toLowerCase().includes(this.searchText.toLowerCase());

}

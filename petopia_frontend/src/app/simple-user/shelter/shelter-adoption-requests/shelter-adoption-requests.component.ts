import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Adoption } from 'src/app/models/adoption/adoption/Adoption';
import { Shelter } from 'src/app/models/adoption/shelter/Shelter';
import { AdoptionService } from 'src/app/services/adoptions/adoption/adoption.service';
import { CertificateService } from 'src/app/services/adoptions/certificate/certificate.service';
import { ShelterService } from 'src/app/services/adoptions/shelter/shelter.service';
import { PetService } from 'src/app/services/pets/pet.service';

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
    private petService: PetService,
    private router: Router,
    private certificateService: CertificateService
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

      return matchesStatus && matchesSearch;
    });

    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination(): void {
    const totalItems = this.filteredRequests.length;
    this.totalPages = Math.ceil(totalItems / this.itemsPerPage);
    this.pageNumbers = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.paginateRequests();
  }

  paginateRequests(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.adoptionRequests = this.filteredRequests.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.paginateRequests();
    }
  }
  private createFormData(pet: any): FormData {
    const formData = new FormData();
    formData.append('petData', JSON.stringify(pet));
    return formData;
  }
  

  approveRequest(request: Adoption): void {
  request.status = 'APPROVED';

  this.adoptionService.updateAdoption(request.id_request, request).subscribe({
    next: () => {
      // ✅ Step 1: Update the pet's status to ADOPTED
      const updatedPet = { ...request.pet, status: 'ADOPTED' };
      this.petService.updatePetWithImage(updatedPet.idPet, this.createFormData(updatedPet)).subscribe({
        next: () => {
          alert('Request approved and pet marked as adopted!');
          const shelterId = request.shelter?.id_shelter || this.shelter?.id_shelter;

          if (!shelterId) {
            console.error('No shelter ID found for this request!');
            alert('Error: Cannot create certificate because shelter info is missing.');
            return;
          }
          
          const payload = {
            pet_id_pet: request.pet.idPet,
            shelter_id_shelter: shelterId,
            user_id_user: request.requester.id_user
          };
          this.certificateService.createCertificate(request.id_request, payload).subscribe({
            next: (cert) => {
              if (!cert.id_certificate) {
                console.error('Certificate creation failed or malformed response:', cert);
                return;
              }
              this.router.navigate(['/shelter/sign-certificate', cert.id_certificate]);
            },
            error: (err) => {
              console.error('Error creating certificate:', err);
              alert('Pet status updated but certificate creation failed.');
            }
          });
          
          
          

          this.applyFilter();
        },
        error: (err) => {
          console.error('Error updating pet status:', err);
          alert('Request approved, but failed to update pet status.');
        }
      });
    },
    error: (err) => {
      console.error('Error approving request:', err);
      alert('Error approving request. Please try again.');
    }
  });
}

  
  rejectRequest(request: Adoption): void {
    request.status = 'REJECTED';
  
    this.adoptionService.updateAdoption(request.id_request, request).subscribe({
      next: () => {
        // Ensure pet is AVAILABLE again (if not already)
        const updatedPet = { ...request.pet, status: 'AVAILABLE' };
        this.petService.updatePetWithImage(updatedPet.idPet, this.createFormData(updatedPet)).subscribe({
          next: () => {
            alert('Request rejected and pet is still available.');
            this.allAdoptionRequests = this.allAdoptionRequests.filter(r => r.id_request !== request.id_request);
            this.applyFilter();
          },
          error: (err) => {
            console.error('Error reverting pet status:', err);
            alert('Request rejected, but failed to update pet status.');
          }
        });
      },
      error: (err) => {
        console.error('Error rejecting request:', err);
        alert('Error rejecting request. Please try again.');
      }
    });
  }
  

  clearStatus(): void {
    this.selectedStatus = '';
    this.applyFilter();
  }

  goToDetails(id: number): void {
    this.router.navigate(['shelter/adoption-requests', id])
      .then(success => {
        if (!success) {
          console.error('Navigation failed');
        }
      });
  }
}
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdoptionService } from 'src/app/services/adoptions/adoption/adoption.service';
import { Adoption } from 'src/app/models/adoption/adoption/Adoption';
import { AdoptionCertificate } from 'src/app/models/adoption/adoption/AdoptionCertificate';
import { CertificateService } from 'src/app/services/adoptions/certificate/certificate.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PetService } from 'src/app/services/pets/pet.service';
import { Shelter } from 'src/app/models/adoption/shelter/Shelter';
import { ShelterService } from 'src/app/services/adoptions/shelter/shelter.service';

@Component({
  selector: 'app-adoption-details',
  templateUrl: './adoption-details.component.html',
  styleUrls: ['./adoption-details.component.css']
})
export class AdoptionDetailsComponent implements OnInit {
  adoption?: Adoption;
  certificate?: AdoptionCertificate;
  certificatePdfUrl: SafeResourceUrl | null = null;
  shelter?: Shelter;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private adoptionService: AdoptionService,
    private certificateService: CertificateService,
    private sanitizer: DomSanitizer,
    private petService: PetService,
    private shelterService: ShelterService,
    
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
      },
      error: (err) => {
        console.error('Error fetching shelter details:', err);
      }
    });
  
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

    const updatedPet = { ...this.adoption.pet, status: 'ADOPTED' };

    this.adoptionService.updateAdoption(this.adoption.id_request, {
      ...this.adoption,
      status: 'APPROVED'
    }).subscribe({
      next: () => {
        this.petService.updatePetWithImage(updatedPet.idPet, this.createFormData(updatedPet)).subscribe({
          next: () => {
            const shelterId =this.shelter?.id_shelter;
            const userId = this.adoption?.requester?.id_user;
            console.log('Shelter ID:', shelterId);
            console.log('User',userId);
            if (!shelterId || !userId) {
              alert('Shelter or user information is missing.');
              return;
            }

            const payload = {
              pet_id_pet: updatedPet.idPet,
              shelter_id_shelter: shelterId,
              user_id_user: userId
            };

            this.certificateService.createCertificate(this.adoption!.id_request, payload).subscribe({
              next: (cert) => {
                alert('Request approved and certificate created!');
                this.router.navigate(['/shelter/sign-certificate', cert.id_certificate]);
              },
              error: (err) => {
                console.error('Certificate creation failed:', err);
                alert('Pet status updated but certificate creation failed.');
              }
            });
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

  rejectRequest(): void {
    if (!this.adoption) return;

    const updatedPet = { ...this.adoption.pet, status: 'AVAILABLE' };

    this.adoptionService.updateAdoption(this.adoption.id_request, {
      ...this.adoption,
      status: 'REJECTED'
    }).subscribe({
      next: () => {
        this.petService.updatePetWithImage(updatedPet.idPet, this.createFormData(updatedPet)).subscribe({
          next: () => {
            alert('Request rejected and pet marked as available.');
            this.router.navigate(['/shelter/adoption-requests']);
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

  goToCertificate(): void {
    if (this.certificate) {
      this.router.navigate(['/shelter/certificate', this.certificate.id_certificate]);
    }
  }

  private createFormData(pet: any): FormData {
    const formData = new FormData();
    formData.append('petData', JSON.stringify(pet));
    return formData;
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdoptionService } from 'src/app/services/adoptions/adoption/adoption.service';
import { Adoption } from 'src/app/models/adoption/adoption/Adoption';

@Component({
  selector: 'app-adoption-details',
  templateUrl: './adoption-details.component.html',
  styleUrls: ['./adoption-details.component.css']
})
export class AdoptionDetailsComponent implements OnInit {
  adoption?: Adoption;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private adoptionService: AdoptionService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.adoptionService.getAdoptionById(+id).subscribe({
        next: (data) => this.adoption = data,
        error: (err) => console.error('Failed to load adoption details', err)
      });
    }
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
}

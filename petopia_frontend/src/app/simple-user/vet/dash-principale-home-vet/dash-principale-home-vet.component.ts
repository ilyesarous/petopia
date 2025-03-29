import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dash-principale-home-vet',
  templateUrl: './dash-principale-home-vet.component.html',
  styleUrls: ['./dash-principale-home-vet.component.css']
})
export class DashPrincipaleHomeVetComponent {

  petId: number | null = null;

  constructor(private router: Router) {}


  navigateToPetGrowth() {
    if (this.petId) {
      this.router.navigate(['home/vet/pet-growth', this.petId]);
    }
  }

}

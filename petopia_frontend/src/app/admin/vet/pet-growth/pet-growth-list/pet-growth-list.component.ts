import { Component, OnInit } from '@angular/core';
import { PetGrowthsService } from 'src/app/services/vet/pet-growth/pet-growths.service';
import { PetGrowth } from 'src/app/models/vet/pet-growth';


@Component({
  selector: 'app-pet-growth-list',
  templateUrl: './pet-growth-list.component.html',
  styleUrls: ['./pet-growth-list.component.css']
})
export class PetGrowthListComponent implements OnInit {

  petGrowths: PetGrowth[] = [];
  selectedPetGrowth: PetGrowth | null = null;

  // var pagination
  p: number = 1; // Page actuelle
  itemsPerPage: number = 3; // Nombre d'éléments par page

  constructor(private PetGrowthsService: PetGrowthsService) { }

  ngOnInit(): void {
    this.loadPetGrowths();
  }

  loadPetGrowths(): void {
    this.PetGrowthsService.getAllPetGrowths().subscribe(
      (data: PetGrowth[]) => {
        this.petGrowths = data;
      },
      (error) => {
        console.error('Error fetching pet growths', error);
      }
    );
  }

  selectPetGrowth(idPet_Growth: number): void {
    this.PetGrowthsService.getPetGrowthById(idPet_Growth).subscribe(
      (data: PetGrowth) => {
        this.selectedPetGrowth = data;
      },
      (error) => {
        console.error('Error fetching pet growth details', error);
      }
    );
  }

}

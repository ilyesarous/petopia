import { Router } from '@angular/router';
import { Component, HostBinding } from '@angular/core';
import { 
    trigger, 
    state, 
    style, 
    animate, 
    transition 
} from '@angular/animations';
import { PetService } from 'src/app/services/pets/pet.service';

@Component({
  selector: 'app-growth-traking-chose-id',
  templateUrl: './growth-traking-chose-id.component.html',
  styleUrls: ['./growth-traking-chose-id.component.css'],
  animations: [
    trigger('cardAnimation', [
        state('in', style({
            opacity: 1,
            transform: 'translateY(0)'
        })),
        transition(':enter', [
            style({
                opacity: 0,
                transform: 'translateY(20px)'
            }),
            animate('0.4s 0.2s ease-out')
        ])
    ]),
    trigger('floatLabel', [
        state('empty', style({
            top: '15px',
            fontSize: '1rem'
        })),
        state('filled', style({
            top: '-10px',
            fontSize: '0.8rem',
            backgroundColor: 'white',
            padding: '0 5px'
        })),
        transition('empty <=> filled', animate('0.2s ease-in-out'))
    ]),
    trigger('pulseAnimation', [
        state('normal', style({
            transform: 'scale(1)'
        })),
        state('hover', style({
            transform: 'scale(1.02)'
        })),
        transition('normal <=> hover', animate('0.3s ease-in-out'))
    ])
]
})
export class GrowthTrakingChoseIdComponent {

  petRefVet: number | null = null; 
  hoverState: 'normal' | 'hover' = 'normal'; 

  constructor(
      private router: Router,
      private petService: PetService 
    ) {}


    navigateToPetGrowth() {
        if (this.petRefVet) {
          // Vérification que c'est un nombre à 3 chiffres
          if (this.petRefVet < 100 || this.petRefVet > 999) {
            alert('Please enter a valid 3-digit reference number');
            return;
          }
    
          this.petService.getPetByRefVet(this.petRefVet).subscribe(
            (pet) => {
              if (pet) {
                this.router.navigate(['/vet/pet-growth', pet.idPet]);
              } else {
                alert('No pet found with reference number: ' + this.petRefVet);
              }
            },
            (error) => {
              console.error('Error finding pet:', error);
              alert('Error finding pet');
            }
          );
        }
      }

}
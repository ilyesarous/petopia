import { Component, OnInit } from '@angular/core';
import { faCheckCircle, faHeart, faHourglassHalf, faTrash } from '@fortawesome/free-solid-svg-icons';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import {PetService} from "../../services/user/pet.service";

@Component({
  selector: 'app-pet-list',
  templateUrl: './pet-list.component.html',
  styleUrls: ['./pet-list.component.css']
})
export class PetListComponent implements OnInit {

  faCheckCircle = faCheckCircle;
  faHeart = faHeart;
  faHourglassHalf = faHourglassHalf;
  faTrash = faTrash;
  isAdmin: boolean = false;

  pets: any[] = [];

  constructor(private petService: PetService,private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.initializeComponent();

  }

  initializeComponent(): void {
    const token = localStorage.getItem('token');
    if (!token) return;

    const payload = JSON.parse(atob(token.split('.')[1]));
    const roles = payload.roles || payload.authorities;
    const userId = localStorage.getItem("userId");

    this.isAdmin = roles.includes('ROLE_ADMIN');

    if (this.isAdmin) {
      this.fetchPets();
    } else if (roles.includes('ROLE_USER')) {
      this.fetchPetsByUserId(userId);
    }
  }
  fetchPets(): void {
    this.petService.getAllPets().subscribe(
      (data: any) => {
        this.pets = data;
      },
      (error) => {
        console.error('Error fetching pets', error);
      }
    );
  }

  deletePet(petId: number): void {
    if (confirm('Are you sure you want to delete this pet?')) {
      this.petService.deletePet(petId).subscribe(
        () => {
          alert('Pet deleted successfully');
          this.initializeComponent();
        },
        (error) => {
          console.error('Error deleting pet', error);
        }
      );
    }
  }

  private fetchPetsByUserId(userId: any) {
    this.petService.getpetByID(userId).subscribe(
      (data: any) => {
        this.pets = data;
      },
      (error) => console.error('Error fetching user pets', error)
    );

  }
}

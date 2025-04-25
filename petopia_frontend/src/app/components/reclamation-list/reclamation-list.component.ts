import { Component, OnInit } from '@angular/core';
import {ReclamationService} from "../../services/user/reclamation.service";

@Component({
  selector: 'app-reclamation-list',
  templateUrl: './reclamation-list.component.html',
  styleUrls: ['./reclamation-list.component.css']
})
export class ReclamationListComponent implements OnInit {
  reclamations: any[] = [];
  selectedReclamation: any = null;
  newDescription: string = '';
  successMessage: string = '';
  errorMessage: string = '';
  loading: boolean = true;

  constructor(
    private reclamationService: ReclamationService
  ) {}

  ngOnInit(): void {
    this.loadReclamations();
  }

  loadReclamations(): void {
    this.loading = true;
    const userIdString = localStorage.getItem('userId');
    if (!userIdString) {
      console.error('User ID not found in localStorage');
      this.loading = false;
      return;
    }

    const userId = parseInt(userIdString, 10);
    if (isNaN(userId)) {
      console.error('Invalid user ID:', userIdString);
      this.loading = false;
      return;
    }

    this.reclamationService.getReclamationByID(userId).subscribe(
      (data) => {
        this.reclamations = data;
        this.loading = false;
        console.log(data);
      },
      (error) => {
        console.error('Error loading reclamations:', error);
        this.loading = false;
      }
    );
  }

  selectReclamation(reclamation: any): void {
    this.selectedReclamation = reclamation;
    this.newDescription = reclamation.description;
  }

  updateDescription(): void {
    const userIdString = localStorage.getItem('userId');
    if (!userIdString) {
      console.error('User ID not found in localStorage');
      return;
    }

    const userId = parseInt(userIdString, 10);
    if (isNaN(userId)) {
      console.error('Invalid user ID:', userIdString);
      return;
    }

    if (this.selectedReclamation && this.newDescription) {
      const reclamationId = this.selectedReclamation.idReclamation;
      this.reclamationService.updateReclamationDescription(userId, reclamationId, this.newDescription).subscribe(
        (response) => {
          console.log('Description updated successfully:', response);
          this.loadReclamations();
          this.selectedReclamation = null;
          this.successMessage = 'Description updated successfully!';
          this.errorMessage = '';
        },
        (error) => {
          console.error('Error updating description:', error);
          this.errorMessage = 'Error updating description. Please try again.';
          this.successMessage = '';
        }
      );
    }
  }
}

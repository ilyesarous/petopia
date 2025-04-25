import { Component, OnInit } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {ResponseDialogComponent} from "../response-dialog/response-dialog.component";
import {ReclamationService} from "../../services/user/reclamation.service";

@Component({
  selector: 'app-list-reclamation',
  templateUrl: './list-reclamation.component.html',
  styleUrls: ['./list-reclamation.component.css']
})
export class ListReclamationComponent implements OnInit {
  reclamations: any[] = [];
  selectedReclamationId: number | null = null;


  constructor(private dialog: MatDialog, private reclamationService: ReclamationService) {}

  ngOnInit(): void {
    this.loadReclamations();
  }

  loadReclamations(): void {
    this.reclamationService.getAllReclamations().subscribe({
      next: (response) => {
        if (response && response.reclamations) {
          this.reclamations = response.reclamations.map((reclamation: any) => ({
            id: reclamation.idReclamation,
            title: reclamation.type,
            username: reclamation.userName,
            description: reclamation.description,
            status: reclamation.statusReclamation,
            createdAt: reclamation.dateReclamation
          }));
        } else {
          console.error('Invalid API response format', response);
          this.reclamations = [];
        }
        console.log(this.reclamations);
      },
      error: (err) => {
        console.error('Error fetching reclamations:', err);
      }
    });
  }

  deleteReclamation(id: number): void {
    if (confirm('Are you sure you want to delete this reclamation?')) {
      this.reclamationService.deleteReclamation(id).subscribe({
        next: () => {
          this.reclamations = this.reclamations.filter(reclamation => reclamation.id !== id);
          console.log('Reclamation deleted successfully');
        },
        error: (err) => {
          console.error('Error deleting reclamation:', err);
        }
      });
    }
  }
  respondToReclamation(reclamation: any): void {
    const dialogRef = this.dialog.open(ResponseDialogComponent, {
      width: '600px',
      data: {reclamation: reclamation}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadReclamations();
      }
    });
  }
}

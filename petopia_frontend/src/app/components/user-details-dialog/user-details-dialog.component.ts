import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-user-details-dialog',
  template: `
    <div class="user-details-container">
      <h2 mat-dialog-title class="dialog-title">User Details</h2>
      <mat-dialog-content class="dialog-content">
        <p class="detail-row"><strong class="detail-label">Email:</strong> <span class="detail-value">{{ data.email }}</span></p>
        <p class="detail-row"><strong class="detail-label">Locked:</strong> <span class="detail-value">{{ data.locked ? 'Yes' : 'No' }}</span></p>
        <p class="detail-row"><strong class="detail-label">Name:</strong> <span class="detail-value">{{ data.name }}</span></p>
        <p class="detail-row"><strong class="detail-label">Phone Number:</strong> <span class="detail-value">{{ data.phoneNumber }}</span></p>
        <p class="detail-row"><strong class="detail-label">Points:</strong> <span class="detail-value">{{ data.nb_points }}</span></p>
        <p class="detail-row"><strong class="detail-label">Role:</strong> <span class="detail-value">{{ data.role }}</span></p>
      </mat-dialog-content>
      <mat-dialog-actions class="dialog-actions">
        <button mat-button mat-dialog-close class="close-button">Close</button>
      </mat-dialog-actions>
    </div>
  `,
  styleUrls: ['./user-details-dialog.component.css']
})
export class UserDetailsDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}

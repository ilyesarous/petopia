import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import {ReclamationService} from "../../services/user/reclamation.service";

@Component({
  selector: 'app-response-dialog',
  template: `
    <h2 mat-dialog-title class="dialog-title">Respond to Reclamation</h2>

    <div mat-dialog-content class="dialog-content">
      <div class="reclamation-info">
        <p><span class="label">Reclamation:</span> <strong>{{ data.reclamation.title }}</strong></p>
        <p><span class="label">User:</span> <strong>{{ data.reclamation.username }}</strong></p>
      </div>

      <mat-form-field appearance="outline" class="full-width-field">
        <mat-label>Your Response</mat-label>
        <textarea matInput [formControl]="responseControl" required></textarea>
        <mat-error *ngIf="responseControl.hasError('required')">
          Response is required
        </mat-error>
      </mat-form-field>

      <mat-form-field appearance="outline" class="status-field">
        <mat-label>Update Status</mat-label>
        <mat-select [formControl]="statusControl">
          <mat-option value="PENDING">Pending</mat-option>
          <mat-option value="IN_PROGRESS">In Progress</mat-option>
          <mat-option value="RESOLVED">Resolved</mat-option>
        </mat-select>
      </mat-form-field>
    </div>

    <div mat-dialog-actions align="end" class="dialog-actions">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary"
              (click)="onSend()"
              [disabled]="responseControl.invalid">
        Send Response
      </button>
    </div>
  `,
  styles: [`
    .dialog-title {
      color: #3f51b5;
      padding-bottom: 16px;
      border-bottom: 1px solid #eee;
      margin-bottom: 16px;
    }

    .dialog-content {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .reclamation-info {
      background: #f5f5f5;
      padding: 12px;
      border-radius: 4px;
    }

    .label {
      color: #666;
      margin-right: 8px;
    }

    .full-width-field {
      width: 100%;
    }

    .full-width-field textarea {
      min-height: 120px;
      resize: vertical;
    }

    .status-field {
      width: 200px;
    }

    .dialog-actions {
      padding-top: 16px;
      border-top: 1px solid #eee;
      margin-top: 16px;
    }

    .dialog-actions button {
      margin-left: 8px;
    }
  `]
})
export class ResponseDialogComponent {
  responseControl = new FormControl('', [Validators.required]);
  statusControl = new FormControl('');

  constructor(
    public dialogRef: MatDialogRef<ResponseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private reclamationService: ReclamationService
  ) {
    // Initialize status with current reclamation status
    this.statusControl.setValue(this.data.reclamation.status);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSend(): void {
    if (this.responseControl.invalid) {
      return;
    }

    const responseText = this.responseControl.value as string;
    const status = this.statusControl.value || undefined;

    this.reclamationService.respondToReclamation(
      this.data.reclamation.id,
      responseText,
      status
    ).subscribe({
      next: () => {
        this.dialogRef.close(true);

      },
      error: (err) => {
        console.error('Error sending response:', err);
      }
    });
  }
}

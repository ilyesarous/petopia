import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-bmi-result-dialog',
  template: `
    <div class="dialog-container">
      <div class="dialog-header">
        <h2>Pet BMI Analysis</h2>
        <button mat-icon-button (click)="onClose()" aria-label="Close dialog">
          <mat-icon>close</mat-icon>
        </button>
      </div>
      
      <div class="dialog-content">
        <div class="bmi-value">
          <span>BMI: </span>
          <strong>{{ data.bmi }}</strong>
        </div>
        
        <div class="status-badge" [style.background]="getStatusColor()">
          {{ data.status | uppercase }}
        </div>
        
        <div class="pet-data">
          <div class="data-item">
            <mat-icon>scale</mat-icon>
            <span>{{ data.weight }}</span>
          </div>
          <div class="data-item">
            <mat-icon>straighten</mat-icon>
            <span>{{ data.height }}</span>
          </div>
          <div class="data-item">
            <mat-icon>calendar_today</mat-icon>
            <span>{{ data.lastMeasurementDate | date }}</span>
          </div>
        </div>
        
        <div class="advice-section">
          <h3>Recommendations</h3>
          <p>{{ data.advice }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dialog-container {
      border-radius: 16px;
      overflow: hidden;
      width: 450px;
      background-color: #f8f9fa;
      color: #495057;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    }
    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px;
      background-color: #FF617C;
      color: white;
    }
    .dialog-header h2 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 500;
    }
    .dialog-header button {
      color: white;
    }
    .dialog-content {
      padding: 24px;
    }
    .bmi-value {
      font-size: 1.8rem;
      text-align: center;
      margin-bottom: 20px;
      color: #343a40;
    }
    .bmi-value strong {
      font-size: 2.2rem;
      color: #FF617C;
    }
    .status-badge {
      display: inline-block;
      padding: 8px 16px;
      border-radius: 20px;
      font-weight: bold;
      margin: 0 auto 20px;
      display: flex;
      justify-content: center;
      width: fit-content;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      color: white;
    }
    .pet-data {
      display: flex;
      justify-content: space-around;
      margin: 20px 0;
      background-color: white;
      padding: 15px;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }
    .data-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      color: #6c757d;
    }
    .data-item mat-icon {
      margin-bottom: 8px;
      color: #FF617C;
    }
    .data-item span {
      font-weight: 500;
      color: #343a40;
    }
    .advice-section {
      background-color: white;
      padding: 16px;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }
    .advice-section h3 {
      margin-top: 0;
      color: #FF617C;
      font-weight: 500;
    }
    .advice-section p {
      color: #495057;
      line-height: 1.6;
    }
  `]
})
export class BmiResultDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<BmiResultDialogComponent>
  ) {}

  getStatusColor(): string {
    switch(this.data.status.toUpperCase()) { // Conversion en majuscules pour être sûr
      case 'UNDERWEIGHT': return '#FF9A7A';  // Orange clair
      case 'NORMAL': return '#4CAF50';       // Vert
      case 'OVERWEIGHT': return '#F83182';   // Rose foncé
      default: return '#FF617C';             // Rose par défaut
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
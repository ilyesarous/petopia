import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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
      <div class="scrollable-content">
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

        <!-- Ajoutez cette section vidéo -->
        <div class="video-section">
          <h4>Educational Video</h4>
          <div class="video-container">
            <iframe 
              width="100%" 
              height="315" 
              [src]="safeVideoUrl" 
              frameborder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowfullscreen>
            </iframe>
          </div>
          <p class="video-link">
            <a [href]="data.videoUrl" target="_blank">Watch on YouTube</a>
          </p>
        </div>

      </div>
    </div>
    </div>
  `,
  styles: [`
    .dialog-container {
      border-radius: 16px;
      overflow: hidden;
      width: 450px;
      max-height: 95vh; 
      display: flex;
      flex-direction: column;
    }
    .dialog-header {
      flex-shrink: 0; 
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
      flex: 1;
      overflow-y: auto; /* Active le défilement vertical */
      padding: 24px;
    }
    .scrollable-content {
      min-height: min-content;
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

    .video-section {
      margin-top: 20px;
    }
    
    .video-container {
      position: relative;
      padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
      height: 0;
      overflow: hidden;
      margin: 15px 0;
      border-radius: 8px;
    }
    
    .video-container iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border: none;
    }
    
    .video-link {
      text-align: center;
    }
    
    .video-link a {
      color: #FF617C;
      text-decoration: none;
      font-weight: 500;
    }
    
    .video-link a:hover {
      text-decoration: underline;
    }
  `]
})
export class BmiResultDialogComponent {

  safeVideoUrl: SafeResourceUrl;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<BmiResultDialogComponent>,
    private sanitizer: DomSanitizer
  ) {
    // Convertir l'URL YouTube en URL embed sécurisée
    const videoId = this.extractVideoId(data.videoUrl);
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  getStatusColor(): string {
    switch(this.data.status.toUpperCase()) { // Conversion en majuscules pour être sûr
      case 'UNDERWEIGHT': return '#FF9A7A';  // Orange clair
      case 'NORMAL': return '#4CAF50';       // Vert
      case 'OVERWEIGHT': return '#F83182';   // Rose foncé
      default: return '#FF617C';             // Rose par défaut
    }
  }

  private extractVideoId(url: string): string {
    // Extraire l'ID vidéo de l'URL YouTube
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
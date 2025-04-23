import { Component , OnInit } from '@angular/core';
import { BrowserQRCodeReader } from '@zxing/browser';
import { Result } from '@zxing/library';
import { Router } from '@angular/router';
import { RatingVet } from 'src/app/models/vet/rating-vet';
import { VetRatingService } from 'src/app/services/vet/rating/vet-rating.service';

@Component({
  selector: 'app-qr-code-vet-scanner',
  templateUrl: './qr-code-vet-scanner.component.html',
  styleUrls: ['./qr-code-vet-scanner.component.css']
})
export class QrCodeVetScannerComponent implements OnInit {
  codeReader: BrowserQRCodeReader;
  scannerControls: any;
  isScanning: boolean = false;
  errorMessage: string | null = null;
  ratings: RatingVet[] = [];
  uniqueVets: string[] = [];
  selectedVet: string = '';
  filteredRatings: RatingVet[] = [];
  topRatedVet: {name: string, average: number, count: number} | null = null;


  constructor(private router: Router,
              private ratingService: VetRatingService
  ) {
    this.codeReader = new BrowserQRCodeReader();
  }

  ngOnInit(): void {
    this.loadAllRatings();
  }

  startScanning(): void {
    this.isScanning = true;
    this.errorMessage = null;
    
    this.codeReader
      .decodeFromVideoDevice(undefined, 'video', (result: Result | undefined, err: Error | undefined) => {
        if (result) {
          const scannedUrl = result.getText();
          console.log('QR Code scanned:', scannedUrl);
          this.handleScannedUrl(scannedUrl);
        }
        if (err) {
          console.error('Error scanning QR code:', err);
        }
      })
      .then((controls: any) => {
        this.scannerControls = controls;
      })
      .catch((err: any) => {
        console.error('Error starting scanner:', err);
        this.errorMessage = 'Could not access camera';
        this.isScanning = false;
      });
  }

  stopScanning(): void {
    if (this.scannerControls) {
      this.scannerControls.stop();
      this.scannerControls = null;
    }
    this.isScanning = false;
  }

  private handleScannedUrl(url: string): void {
    this.stopScanning();
    
    // Vérifier si l'URL est valide
    if (!this.isValidUrl(url)) {
      this.errorMessage = 'Invalid URL in QR code';
      return;
    }

    // Extraire le chemin après le domaine
    const baseUrl = window.location.origin;
    let redirectPath = url;
    
    // Si l'URL contient notre domaine, on prend seulement le chemin
    if (url.includes(baseUrl)) {
      redirectPath = url.replace(baseUrl, '');
    }

    // Redirection
    this.router.navigateByUrl(redirectPath).catch(() => {
      // Si la navigation échoue, la page 404 d'Angular prendra le relais automatiquement
      this.errorMessage = 'Page not found';
    });
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }


  loadAllRatings(): void {
    this.ratingService.getAllRatings().subscribe({
      next: (ratings) => {
        this.ratings = ratings;
        this.filteredRatings = [...ratings];
        this.extractUniqueVets();
        this.calculateTopRatedVet(ratings); // Ajout de cet appel
      },
      error: (err) => {
        console.error('Failed to load ratings:', err);
      }
    });
  }

  private extractUniqueVets(): void {
    // Extraire les noms uniques des vétérinaires
    const allVetNames = this.ratings.map(r => r.uservetR.name || 'Unknown Veterinarian');
    this.uniqueVets = [...new Set(allVetNames)].sort();
  }

  filterRatings(): void {
    if (!this.selectedVet) {
      this.filteredRatings = [...this.ratings];
    } else {
      this.filteredRatings = this.ratings.filter(rating => 
        (rating.uservetR.name || 'Unknown Veterinarian') === this.selectedVet
      );
    }
  }

  private calculateTopRatedVet(ratings: RatingVet[]): void {
    // Créer un objet pour stocker les données par vétérinaire
    const vetStats: {[key: string]: {total: number, count: number}} = {};
  
    // Calculer le total et le nombre de notes par vétérinaire
    ratings.forEach(rating => {
      const vetName = rating.uservetR.name || 'Unknown Veterinarian';
      if (!vetStats[vetName]) {
        vetStats[vetName] = {total: 0, count: 0};
      }
      vetStats[vetName].total += rating.note;
      vetStats[vetName].count++;
    });
  
    // Calculer les moyennes et trouver le meilleur
    let topVet = null;
    let highestAvg = 0;
  
    for (const [name, stats] of Object.entries(vetStats)) {
      const average = stats.total / stats.count;
      if (average > highestAvg) {
        highestAvg = average;
        topVet = {
          name,
          average: parseFloat(average.toFixed(2)), // Arrondir à 2 décimales
          count: stats.count
        };
      }
    }
  
    this.topRatedVet = topVet;
  }
  
}
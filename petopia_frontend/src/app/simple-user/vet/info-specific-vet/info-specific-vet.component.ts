import { Component , OnInit} from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { QrCodeVetService } from 'src/app/services/vet/qrcodeVet/qr-code-vet.service';

@Component({
  selector: 'app-info-specific-vet',
  templateUrl: './info-specific-vet.component.html',
  styleUrls: ['./info-specific-vet.component.css']
})
export class InfoSpecificVetComponent implements OnInit {
  vetName: string = '';
  vetEmail: string = '';
  qrImageUrl: SafeUrl | null = null;
  isLoading: boolean = true;

  constructor(
    private qrCodeService: QrCodeVetService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    // Récupérer l'email du vétérinaire connecté
    this.vetEmail = localStorage.getItem('username') || '';
    
    // Extraire le nom avant le @
    this.vetName = this.extractNameFromEmail(this.vetEmail);
    
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.loadQrCode(parseInt(userId));
    }
  }

  private extractNameFromEmail(email: string): string {
    if (!email) return 'Docteur';
    
    const namePart = email.split('@')[0];
    
    // Supprimer les suffixes et mettre en forme
    return namePart
      .replace(/VET$/i, '') // Enlève "VET" à la fin
      .replace(/[._-]/g, ' ') // Remplace les séparateurs par des espaces
      .replace(/\b\w/g, c => c.toUpperCase()); // Met en majuscule la première lettre de chaque mot
  }

  loadQrCode(vetId: number): void {
    this.isLoading = true;
    this.qrCodeService.getVetQrCode(vetId).subscribe(
      (blob) => {
        const url = URL.createObjectURL(blob);
        this.qrImageUrl = this.sanitizer.bypassSecurityTrustUrl(url);
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading QR code:', error);
        this.isLoading = false;
      }
    );
  }
}
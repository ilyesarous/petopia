import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {AuthService} from "../../services/user/auth.service";
import {ReclamationService} from "../../services/user/reclamation.service";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent implements OnInit {
  isAuthenticated: boolean = false;
  reclamationText: string = '';
  selectedType: string = 'Bug'; // Default type
  showNotification: boolean = false;
  showBadWordWarning: boolean = false;
  role: string = '';

  private badWords: string[] = [
    'fuck', 'f-ck', 'f*ck', 'f**k', 'f***',
    'shit', 'sh*t', 's***',
    'asshole', 'a**hole',
    'bitch', 'b*tch', 'b****',
    'cunt', 'c*nt',
    'damn', 'd*mn',
    'hell', 'h*ll',
    'isreal', 'nigga'
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private reclamationService: ReclamationService,
  ) {}

  ngOnInit() {
    this.authService.isAuthenticated.subscribe((status) => {
      this.isAuthenticated = status;
    });
    this.authService.role.subscribe((role) => {
      this.role = role;
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  containsBadWords(text: string): boolean {
    if (!text) return false;

    const lowerText = text.toLowerCase();
    return this.badWords.some(word => {
      // Check for the word and common variations with symbols
      const regex = new RegExp(word.replace(/\*/g, '\\*').replace(/-/g, '\\-'), 'i');
      return regex.test(lowerText);
    });
  }

  submitReclamation() {
    this.showBadWordWarning = false;

    // Check for bad words
    if (this.containsBadWords(this.reclamationText)) {
      this.showBadWordWarning = true;
      return;
    }

    const userId = localStorage.getItem('userId');
    if (this.reclamationText.trim()) {
      const reclamation = {
        type: this.selectedType,
        description: this.reclamationText,
        statusReclamation: 'PENDING',
        dateReclamation: new Date(),
        user: { id_user: userId }
      };

      this.reclamationService.addReclamation(reclamation).subscribe(
        (response) => {
          this.showNotification = true;
          setTimeout(() => {
            this.showNotification = false;
            window.location.reload();
          }, 5000);

          this.reclamationText = '';
        },
        (error) => {
          console.error('Error submitting reclamation:', error);
          alert('There was an error submitting your reclamation. Please try again.');
        }
      );
    } else {
      alert('Please enter your reclamation.');
    }
  }
}

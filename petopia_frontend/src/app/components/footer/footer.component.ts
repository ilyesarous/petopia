import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/user/auth.service';
import { ReclamationService } from '../../services/user/reclamation.service';

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
  role: string = '';


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

  submitReclamation() {
    const userId = localStorage.getItem('userId');
    if (this.reclamationText.trim()) {
      const reclamation = {
        type: this.selectedType,
        description: this.reclamationText,
        statusReclamation: 'non traité',
        dateReclamation: new Date(),
        user: { id_user: userId }
      };
      console.log(reclamation);
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

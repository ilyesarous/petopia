import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../services/user/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isAuthenticated: boolean = false;
  username: string = '';
  role: string = '';
  isDropdownOpen = false;
  isMobileMenuOpen = false;
  selectedItem: string = 'Home';
  showMatchingDropdown: boolean = false;
  showCommunityDropdown = false;

  list:any[] = [
    {id: 1, icon: 'bi bi-envelope'},
    {id: 2, icon: 'bi bi-bell'},
  ]
  showEventsDropdown = false; // Add this line


  ngOnInit() {
    this.authService.isAuthenticated.subscribe((status) => {
      this.isAuthenticated = status;
    });

    this.authService.username.subscribe((username) => {
      this.username = username;
    });

    this.authService.role.subscribe((role) => {
      this.role = role || ''; // Ensure role is never undefined
    });
  }


  pages = [
    { id: 1, name: 'Home', link: '/home' },
  ];

  constructor(private authService: AuthService, private router: Router) {}




  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  reloadPage(event: Event) {
    event.preventDefault();
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/']);
    });
  }
}

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
    { id: 2, name: 'Store', link: '/products' },
    { id: 3, name: 'Community Hub', link: 'community' },
    { id: 4, name: 'Events', link: '#' },
    { id: 5, name: 'Vet', link: 'vet' },
    {id: 6, name: 'Adoption', link: 'adoption'},
  ];

  shelterPages = [
    {id: 0, name: 'Home', link: 'shelter/home'},
     {id:1 , name: 'MyPets', link: 'shelter/pets'},
     {id:2 , name: 'Adoption Requests', link: 'shelter/adoption-requests'}
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

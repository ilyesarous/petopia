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
    { id: 2, name: 'Store', link: '/products' },
    { id: 3, name: 'Community', link: '/community' },
    { id: 4, name: 'Events', link: '/events' },
    { id: 5, name: 'Vet', link: '/vet/dash-principale-user' },
    {id: 6, name: 'Adoption', link: 'adoption'},
    {id: 7, name: 'Matching', link: 'matchy'},
  ];

  shelterPages = [
    {id: 0, name: 'Home', link: 'shelter/home'},
     {id:1 , name: 'MyPets', link: 'shelter/pets'},
     {id:2 , name: 'Adoption Requests', link: 'shelter/adoption-requests'}
  ];

  partnerPages = [
    {id: 0, name: 'Home', link: 'partner/home'}
  ]

  VETpages = [
    { id: 1, name: 'Vet Dashboard', link: '/vet' },
    { id: 2, name: 'Locations', link: '/vet/location' },
    { id: 3, name: 'Vet Info', link: 'vet/info-specific-vet/:id' },
    { id: 4, name: 'ratings', link: 'vet/info-rating-vet' },
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

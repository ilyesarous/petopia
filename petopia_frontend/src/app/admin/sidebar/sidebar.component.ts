import { Component } from '@angular/core';
import {AuthService} from "../../services/user/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

    isAuthenticated: boolean = false;
    username: string = '';
    role: string = '';

  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit() {
    this.authService.isAuthenticated.subscribe((status) => {
      this.isAuthenticated = status;
    });
    this.authService.username.subscribe((username) => {
      this.username = username;
    });
    this.authService.role.subscribe((role) => {
      this.role = role;
    });
  }


  selectedItem: string = '';

  items: any[] = [
    { name: 'Home', route: '/dashboard', icon: 'bi bi-house' },
    { name: 'Users', route: 'user', icon: 'bi bi-person'},
    { name: 'Shop', route: 'store', icon: 'bi bi-cart'},
    { name: 'Vet', route: 'vet', icon: 'bi bi-activity'},
    { name: 'Shelters', route: 'shelters', icon: 'bi bi-house-heart' },
    { name: 'Event', route: 'events', icon: 'bi bi-calendar3'},
    { name: 'Community Hub', route: 'community', icon: 'bi bi-people'},
    { name: 'Settings', route: '#', icon: 'bi bi-gear'},
  ];

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }


}

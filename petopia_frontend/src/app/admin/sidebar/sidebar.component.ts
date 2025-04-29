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
    selectedItem: string = '';

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
    this.selectedItem = localStorage.getItem("selectedItemSideBar")! 
  }


  

  selectItem(item: any): void{
    this.selectedItem = item.name;
    localStorage.setItem("selectedItemSideBar", this.selectedItem)
  }

  items: any[] = [
    { name: 'Users', route: 'ListUsers', icon: 'bi bi-people' },
    { name: 'Shelters', route: 'shelters', icon: 'bi bi-house-heart' },
    { name: 'Pets', route: 'ListPets', icon: 'bi bi-house-heart' },
    { name: 'Shop', route: 'store', icon: 'bi bi-cart'},
    { name: 'Vet', route: 'vet', icon: 'bi bi-activity'},
    { name: 'Event', route: 'events', icon: 'bi bi-calendar3'},
    { name: 'Community', route: 'community', icon: 'bi bi-people'},
    { name: 'Requests', route: 'listReclamation', icon: 'bi bi-inbox' },
    { name: 'Matching', route: 'match-back', icon: 'bi bi-heart'},
    { name: 'Logout', icon: 'bi bi-box-arrow-right' },
  ];

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }


}

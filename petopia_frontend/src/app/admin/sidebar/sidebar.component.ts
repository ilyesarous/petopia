import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  selectedItem: string = '';

  items: any[] = [
    { name: 'Home', route: '/dashboard', icon: 'bi bi-house' },
    { name: 'Users', route: 'user', icon: 'bi bi-person'},
    { name: 'Shop', route: 'store', icon: 'bi bi-cart'},
    { name: 'Vet', route: 'vet', icon: 'bi bi-activity'},
    { name: 'Event', route: '#', icon: 'bi bi-calendar3'},
    { name: 'Community Hub', route: '#', icon: 'bi bi-people'},
    { name: 'Settings', route: '#', icon: 'bi bi-gear'},
  ];

}

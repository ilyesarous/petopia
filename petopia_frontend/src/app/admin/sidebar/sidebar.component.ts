import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  selectedItem: string = 'Home'; 
  
  items: any[] = [
    { name: 'Home', route: '/dashboard', icon: 'bi bi-house' },
    { name: 'Users', route: '#', icon: 'bi bi-person'},
    { name: 'Shop', route: '#', icon: 'bi bi-cart'},
    { name: 'Vet', route: '#', icon: 'bi bi-activity'},
    { name: 'Event', route: '#', icon: 'bi bi-calendar3'},
    { name: 'Community Hub', route: '#', icon: 'bi bi-people'},
    { name: 'Settings', route: '#', icon: 'bi bi-gear'},
  ];

}

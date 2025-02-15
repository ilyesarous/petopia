import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  list:any[] = [
    {id: 1, icon: 'bi bi-envelope'},
    {id: 2, icon: 'bi bi-bell'},
  ]
  selectedItem: string = 'Home'; 
  pages:any[] = [
    {id: 1, name: 'Home', link: '/home'},
    {id: 2, name: 'Store', link: '#'},
    {id: 3, name: 'Community Hub', link: '#'},
    {id: 4, name: 'Events', link: '#'},
    {id: 5, name: 'Vet', link: '#'},
  ]

}

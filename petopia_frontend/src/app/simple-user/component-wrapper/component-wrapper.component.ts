import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/user/auth.service';

@Component({
  selector: 'app-component-wrapper',
  templateUrl: './component-wrapper.component.html',
  styleUrls: ['./component-wrapper.component.css']
})
export class ComponentWrapperComponent implements OnInit{
  isAuthenticated: boolean = false;
  role: string ="";
  constructor(private authService: AuthService){}

  ngOnInit(): void {
    this.authService.isAuthenticated.subscribe((status) => {
      this.isAuthenticated = status;
    });
    this.authService.role.subscribe((role) => {
      this.role = role || ''; // Ensure role is never undefined
    });
  }
}

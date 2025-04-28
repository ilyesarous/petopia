import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/user/auth.service";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  user: any;
  isPanelOpen = false;

  constructor(private userService: AuthService) {}

  ngOnInit(): void {
    const userId = this.getUserIdFromLocalStorage();
    if (userId) {
      this.userService.getUserById(userId).subscribe(
        (data) => {
          this.user = data;
        },
        (error) => {
          console.error('Error fetching user data:', error);
        }
      );
    }
  }

  getUserIdFromLocalStorage(): number | null {
    const userId = localStorage.getItem('userId');
    return userId ? parseInt(userId, 10) : null;
  }
}

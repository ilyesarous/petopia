import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {AuthService} from "../../services/user/auth.service";

@Component({
  selector: 'app-edit-profile-panel',
  templateUrl: './edit-profile-panel.component.html',
  styleUrls: ['./edit-profile-panel.component.css']
})
export class EditProfilePanelComponent implements OnInit {
  user: any = {
    userId: 0,
    username: '',
    email: '',
    phoneNumber: ''
  };

  constructor(private userService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      this.user.userId = Number(storedUserId);
      console.log("User ID loaded:", this.user.userId);
    } else {
      console.error("User ID not found in localStorage");
    }
  }

  onSubmit(): void {
    const { userId, username, email, phoneNumber } = this.user;
    const body: any = {};
    if (username) body.username = username;
    if (email) body.email = email;
    if (phoneNumber) body.phoneNumber = phoneNumber;
    this.userService.updateUser(userId, body).subscribe({
      next: (res) => {
        alert('Profile updated successfully!');
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/profileUser']);
        });
      },
      error: (err) => {
        alert('Failed to update profile');
        console.error(err);
      }
    });
  }
}

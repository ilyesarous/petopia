import {Component, OnDestroy, OnInit} from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { UserDetailsDialogComponent } from "../user-details-dialog/user-details-dialog.component";
import {AuthService} from "../../services/user/auth.service";
import {Subscription} from "rxjs";
import {NotificationService, SignupNotification} from "../../services/user/notification-service.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.css']
})
export class ListUsersComponent implements OnInit, OnDestroy {

  notifications: SignupNotification[] = [];
  private notificationSub!: Subscription;
  private roleSub!: Subscription;
  users: any[] = [];
  searchTerm: string = '';
  role: string = '';

  constructor(private authService: AuthService, private dialog: MatDialog,private notificationService: NotificationService,private router: Router) {}

  ngOnInit(): void {
    this.fetchAllUsers();
    this.loadNotifications();

  }
  loadNotifications() {
    this.notificationSub = this.notificationService.getNotifications().subscribe(
      notifications => this.notifications = notifications
    );
  }

  ngOnDestroy() {
    if (this.notificationSub) {
      this.notificationSub.unsubscribe();
    }
    if (this.roleSub) {
      this.roleSub.unsubscribe();
    }
  }

  clearNotifications() {
    this.notificationService.clearNotifications();
  }


  fetchAllUsers(): void {
    this.authService.getAllUsers().subscribe({
      next: (response) => {
        this.users = response.ourUsersList
          .filter((user: any) => user.role !== 'ADMIN')
          .map((user: any) => ({
            id: user.id_user,
            email: user.email,
            locked: user.locked,
            name: user.name,
            phoneNumber: user.phoneNumber,
            nb_points: user.nb_points,
            role: user.role
          }));
      },
      error: (err) => {
        console.error('Error fetching users:', err);
      }
    });
  }

  get filteredUsers(): any[] {
    if (!this.searchTerm) {
      return this.users;
    }
    return this.users.filter(user =>
      user.email.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  viewUserDetails(user: any): void {
    this.dialog.open(UserDetailsDialogComponent, {
      width: '400px',
      data: user,
      disableClose: true,
      hasBackdrop: true,
      panelClass: 'custom-dialog-container'
    });
  }

  deleteUser(userId: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.authService.deleteUser(userId).subscribe({
        next: () => {
          this.users = this.users.filter(user => user.id !== userId);
        },
        error: (err) => {
          console.error('Error deleting user:', err);
        }
      });
    }
  }

  refreshUsers(): void {
    this.fetchAllUsers();
  }

}

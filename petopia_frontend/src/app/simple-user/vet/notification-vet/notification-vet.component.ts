import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/services/vet/notifications/notification.service';
import { Notification } from 'src/app/models/vet/notification';
import { NotificationStateService } from 'src/app/services/vet/notifications/notification-state.service';
import { AuthService } from 'src/app/services/user/auth.service';

@Component({
  selector: 'app-notification-vet',
  templateUrl: './notification-vet.component.html',
  styleUrls: ['./notification-vet.component.css']
})
export class NotificationVetComponent implements OnInit {
  notifications: Notification[] = [];
  showNotifications = false;
  unreadCount = 0;
  showAddForm = false;
  newNotification: { message: string } = { message: '' };
  userId: number | null = null;
  users: any[] = [];
  selectedUsers: number[] = [];
  showUserSelection = false;

  constructor(
    private notificationService: NotificationService,
    private notificationState: NotificationStateService,
    private authService: AuthService
  ) { }

  
  ngOnInit(): void {
    const userIdStr = localStorage.getItem('userId');
    this.userId = userIdStr ? parseInt(userIdStr) : null;
    
    if (this.userId) {
      this.loadNotifications();
      this.loadAllUsers(); // Charger la liste des utilisateurs
    }
    
    this.notificationState.showNotifications$.subscribe(show => {
      this.showNotifications = show;
      if (show && this.userId) {
        this.loadNotifications();
      }
    });
  }

  loadAllUsers(): void {
    this.authService.RetriveAllUsers().subscribe({
      next: (response) => {
        // Accédez à la propriété ourUsersList de la réponse
        this.users = response.ourUsersList || [];
      },
      error: (err) => {
        console.error('Error loading users', err);
      }
    });
  }

  loadNotifications(): void {
    if (!this.userId) return;
    
    this.notificationService.getUserNotifications(this.userId).subscribe({
      next: (data) => {
        this.notifications = data;
        this.sortNotifications();
        this.updateUnreadCount();
      },
      error: (err) => {
        console.error('Error loading notifications', err);
      }
    });
  }

  sortNotifications(): void {
    this.notifications.sort((a, b) => 
      new Date(b.notif_date).getTime() - new Date(a.notif_date).getTime()
    );
  }

  updateUnreadCount(): void {
    this.unreadCount = this.notifications.filter(n => !n.seen).length;
  }

  toggleNotifications(): void {
    this.notificationState.toggleNotifications(!this.showNotifications);
  }

  markAsRead(notification: Notification): void {
    if (!notification.seen) {
      this.notificationService.updateNotificationStatus(notification.idNotification, true).subscribe({
        next: () => {
          notification.seen = true;
          this.updateUnreadCount();
        },
        error: (err) => {
          console.error('Error marking notification as read', err);
        }
      });
    }
  }

  deleteNotification(id: number, event: Event): void {
    event.stopPropagation();
    this.notificationService.deleteNotification(id).subscribe({
      next: () => {
        this.notifications = this.notifications.filter(n => n.idNotification !== id);
        this.updateUnreadCount();
      },
      error: (err) => {
        console.error('Error deleting notification', err);
      }
    });
  }

  getTimeAgo(date: Date): string {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - notificationDate.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds} sec ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  }

  addNotification(): void {
    if (!this.newNotification.message.trim()) return;
  
    // Si aucun utilisateur n'est sélectionné, envoyer seulement à l'utilisateur connecté
    if (this.selectedUsers.length === 0 && this.userId) {
      this.selectedUsers.push(this.userId);
    }
  
    // Créer une notification pour chaque utilisateur sélectionné
    const notificationsToAdd = this.selectedUsers.map(userId => ({
      message: this.newNotification.message,
      seen: false,
      user: { id_user: userId }
    }));
  
    // Envoyer chaque notification
    notificationsToAdd.forEach(notification => {
      this.notificationService.addNotification(notification).subscribe({
        next: (addedNotification) => {
          this.notifications.unshift(addedNotification);
          this.updateUnreadCount();
        },
        error: (err) => {
          console.error('Error adding notification', err);
        }
      });
    });
  
    // Réinitialiser le formulaire
    this.newNotification.message = '';
    this.selectedUsers = [];
    this.showAddForm = false;
    this.showUserSelection = false;
  }

  toggleUserSelection(): void {
    this.showUserSelection = !this.showUserSelection;
  }
  
  isUserSelected(userId: number): boolean {
    return this.selectedUsers.includes(userId);
  }
  
  toggleUserSelectionStatus(userId: number): void {
    const index = this.selectedUsers.indexOf(userId);
    if (index === -1) {
      this.selectedUsers.push(userId);
    } else {
      this.selectedUsers.splice(index, 1);
    }
  }
  
}
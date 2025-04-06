import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/services/vet/notifications/notification.service';
import { Notification } from 'src/app/models/vet/notification';
import { NotificationStateService } from 'src/app/services/vet/notifications/notification-state.service';
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

  constructor(
    private notificationService: NotificationService,
    private notificationState: NotificationStateService
  ) { }

  ngOnInit(): void {
    this.loadNotifications();
    
    this.notificationState.showNotifications$.subscribe(show => {
      this.showNotifications = show;
      if (show) {
        this.loadNotifications();
      }
    });
  }


  loadNotifications(): void {
    this.notificationService.getAllNotifications().subscribe({
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

    // Créez un objet Notification complet si nécessaire
    const notificationToAdd = {
      message: this.newNotification.message,
      seen: false,
      user: { id_user: 1 } // Remplacez par l'ID de l'utilisateur approprié
    };

    this.notificationService.addNotification(notificationToAdd).subscribe({
      next: (addedNotification) => {
        this.notifications.unshift(addedNotification); // Ajoute au début du tableau
        this.updateUnreadCount();
        this.newNotification.message = ''; // Réinitialise le champ
        this.showAddForm = false; // Cache le formulaire
      },
      error: (err) => {
        console.error('Error adding notification', err);
      }
    });
  }
  
}
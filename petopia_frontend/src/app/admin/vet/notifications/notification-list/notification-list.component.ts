import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/services/vet/notification.service';
import { Notification } from 'src/app/models/vet/notification';

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.css']
})
export class NotificationListComponent implements OnInit {

  notifications: Notification[] = [];
  selectedNotification: Notification | null = null; // Notification sélectionnée

  constructor(private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.notificationService.getAllNotifications().subscribe(
      (data: Notification[]) => {
        this.notifications = data;
      },
      (error) => {
        console.error('Error fetching notifications', error);
      }
    );
  }

   // Sélectionner une notification
   selectNotification(idNotification: number): void {
    this.notificationService.getNotificationById(idNotification).subscribe(
      (data: Notification) => {
        this.selectedNotification = data;
      },
      (error) => {
        console.error('Error fetching notification details', error);
      }
    );
  }

  // Marquer une notification comme "vue"
  markAsSeen(idNotification: number): void {
    this.notificationService.updateNotificationStatus(idNotification, true).subscribe(
      () => {
        // Mettre à jour la notification dans la liste
        const notification = this.notifications.find(n => n.idNotification === idNotification);
        if (notification) {
          notification.seen = true;
        }
        console.log('Notification marquée comme vue');
      },
      (error) => {
        console.error('Erreur lors de la mise à jour de la notification', error);
      }
    );
  }

  // Supprimer une notification
  deleteNotification(idNotification: number): void {
    this.notificationService.deleteNotification(idNotification).subscribe(
      () => {
        // Retirer la notification de la liste
        this.notifications = this.notifications.filter(n => n.idNotification !== idNotification);
        console.log('Notification supprimée');
      },
      (error) => {
        console.error('Erreur lors de la suppression de la notification', error);
      }
    );
  }
}
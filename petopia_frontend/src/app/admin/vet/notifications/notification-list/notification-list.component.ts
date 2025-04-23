import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/services/vet/notifications/notification.service';
import { Notification } from 'src/app/models/vet/notification';


@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.css']
})
export class NotificationListComponent implements OnInit {

  notifications: Notification[] = [];
  selectedNotification: Notification | null = null; // Notification sélectionnée

  seenCount: number = 0; // Nombre de notifications vues
  unseenCount: number = 0; // Nombre de notifications non vues

  // var pagination
  p: number = 1; // Page actuelle
  itemsPerPage: number = 3; // Nombre d'éléments par page

  constructor(private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.loadNotifications();
    this.loadNotificationStats();

  }

  loadNotificationStats(): void {
    this.notificationService.getAllNotifications().subscribe(
      (notifications: any[]) => {
        console.log('Notifications:', notifications); // Les données sont bien récupérées
        this.seenCount = notifications.filter(n => n.seen).length;
        this.unseenCount = notifications.filter(n => !n.seen).length;
        console.log('Seen Count:', this.seenCount); // Doit afficher 2
        console.log('Unseen Count:', this.unseenCount); // Doit afficher 1
      },
      (error) => {
        console.error('Error fetching notifications', error);
      }
    );
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
import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/services/vet/notification.service';

@Component({
  selector: 'app-dash-principale',
  templateUrl: './dash-principale.component.html',
  styleUrls: ['./dash-principale.component.css'],
})
export class DashPrincipaleComponent implements OnInit {

  seenCount: number = 0; // Nombre de notifications vues
  unseenCount: number = 0; // Nombre de notifications non vues

  constructor(private notificationService: NotificationService) { }

  ngOnInit(): void {
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

}

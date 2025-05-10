import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Notification } from 'src/app/models/vet/notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private apiUrl = 'http://spring-service:7000/petopia/auth/Notification';

  constructor(private http: HttpClient) { }

  getAllNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}/retriveAllNotification`);
  }

  // Méthode pour prendre l'ID utilisateur en paramètre
  getUserNotifications(userId: number): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}/retrieveUserNotifications/${userId}`);
  }

  updateNotificationStatus(idNotification: number, seen: boolean): Observable<void> {
    const url = `${this.apiUrl}/updateNotificationStatus/${idNotification}`;
    return this.http.put<void>(url, { seen }); // Envoyer { seen } dans le corps de la requête
  }

  deleteNotification(idNotification: number): Observable<void> {
    const url = `${this.apiUrl}/deleteNotification/${idNotification}`;
    return this.http.delete<void>(url);
  }

  getNotificationById(idNotification: number): Observable<Notification> {
    const url = `${this.apiUrl}/retriveNotification/${idNotification}`;
    return this.http.get<Notification>(url);
  }

  addNotification(notification: any): Observable<Notification> {
    return this.http.post<Notification>(`${this.apiUrl}/addNotification`, notification);
  }

}

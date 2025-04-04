import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Client, Message } from '@stomp/stompjs';
import SockJS from 'sockjs-client';


export interface SignupNotification {
  userId: string;
  name: string;
  email: string;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<SignupNotification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  private stompClient!: Client;  // Definite assignment assertion
  private isConnected = false;

  constructor() {
    this.initializeWebSocketConnection();
  }

  private initializeWebSocketConnection() {
    const serverUrl = 'http://localhost:888/ws';
    const ws = new SockJS(serverUrl);
    this.stompClient = new Client({
      webSocketFactory: () => ws,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,

    });

    this.stompClient.onConnect = (frame) => {
      this.isConnected = true;
      this.stompClient.subscribe('/topic/new-signups', (message: Message) => {
        const notification: SignupNotification = JSON.parse(message.body);
        this.addNotification(notification);
      });
    };

    this.stompClient.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    };

    this.stompClient.activate();
  }

  private addNotification(notification: SignupNotification) {
    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next([notification, ...currentNotifications]);
  }

  public getNotifications(): Observable<SignupNotification[]> {
    return this.notifications$;
  }

  public clearNotifications() {
    this.notificationsSubject.next([]);
  }
}

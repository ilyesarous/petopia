import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Client, Message } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export interface EventNotification {
  nameEvent: string;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class EventNotificationService {
  private notificationsSubject = new BehaviorSubject<EventNotification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  private stompClient!: Client;
  private isConnected = false;

  constructor() {
    this.initializeWebSocketConnection();
  }

  private initializeWebSocketConnection() {
    const serverUrl = 'http://petopia.local:31158/petopia/ws'; // Your backend WebSocket endpoint
    const ws = new SockJS(serverUrl);

    this.stompClient = new Client({
      webSocketFactory: () => ws,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.stompClient.onConnect = (frame) => {
      this.isConnected = true;
      this.stompClient.subscribe('/topic/new-events', (message: Message) => {
        const notification: EventNotification = JSON.parse(message.body);
        this.addNotification(notification);
      });
    };

    this.stompClient.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    };

    this.stompClient.activate();
  }

  private addNotification(notification: EventNotification) {
    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next([notification, ...currentNotifications]);
  }

  public getNotifications(): Observable<EventNotification[]> {
    return this.notifications$;
  }

  public clearNotifications() {
    this.notificationsSubject.next([]);
  }
}

import { Injectable } from '@angular/core';
import { Client, over } from 'stompjs';
import SockJS from 'sockjs-client';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private stompClient: Client;
  private messages: any[] = [];
  private messageSubject = new Subject<any>();
  public connected = false;

  constructor() {
    this.stompClient = {} as Client;
    this.connect();
  }

  connect() {
    const socket = new SockJS('http://localhost:888/ws');
    this.stompClient = over(socket);

    this.stompClient.connect({},
      (frame) => {
        console.log('Connected: ' + frame);
        this.connected = true;

        // Private messages subscription
        this.stompClient.subscribe('/user/queue/private', (message) => {
          this.handleIncomingMessage(message);
        });

        // Public messages subscription
        this.stompClient.subscribe('/topic/public', (message) => {
          this.handleIncomingMessage(message);
        });
      },
      (error) => {
        console.error('WebSocket connection error:', error);
        this.connected = false;
        setTimeout(() => this.connect(), 5000); // Reconnect after 5 seconds
      }
    );
  }

  private handleIncomingMessage(message: any) {
    const parsedMessage = JSON.parse(message.body);
    console.log('Received message:', parsedMessage);
    this.messages.push(parsedMessage);
    this.messageSubject.next(parsedMessage);
  }

  sendMessage(message: any) {
    if (!this.connected) {
      console.error('Cannot send message - not connected to WebSocket');
      return;
    }

    console.log('WebSocket sending message:', message);

    this.stompClient.send('/app/chat.sendMessage', {}, JSON.stringify(message));
  }


  getMessages() {
    return this.messages;
  }

  onNewMessage() {
    return this.messageSubject.asObservable();
  }

  isConnected() {
    return this.connected;
  }
}

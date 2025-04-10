import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Subject, Observable } from 'rxjs';
import { ChatMessage } from 'src/app/services/matchingService/messaging.service';

@Injectable({
  providedIn: 'root'
})
export class ChatWebSocketService {
  private stompClient: Client | null = null; // Changed to nullable to delay initialization
  private chatMessagesByMatch: Map<number, ChatMessage[]> = new Map();
  private chatMessageSubject = new Subject<{ matchId: number; message: ChatMessage }>();
  public connected = false;

  constructor() {
    // Remove immediate initialization from constructor
    console.log('ChatWebSocketService instantiated');
  }

  // Lazy initialization method
  public initializeWebSocket(): void {
    if (this.stompClient) {
      console.log('WebSocket already initialized');
      return;
    }

    try {
      this.stompClient = new Client({
        webSocketFactory: () => new SockJS('http://localhost:8082/ws'), // Correct port
        reconnectDelay: 5000,
        debug: (str) => console.log(str)
      });

      this.stompClient.onConnect = (frame) => {
        console.log('Chat WebSocket Connected: ' + frame);
        this.connected = true;
        this.chatMessageSubject.next({
          matchId: 0,
          message: {
            matchId: 0,
            senderId: 0,
            receiverId: 0,
            content: 'Connected',
            type: 'CONNECTION',
            timestamp: new Date().toISOString()
          }
        });
      };

      this.stompClient.onStompError = (error) => {
        console.error('Chat WebSocket Error:', error);
        this.connected = false;
      };

      this.stompClient.onDisconnect = () => {
        console.log('Chat WebSocket Disconnected');
        this.connected = false;
      };

      this.stompClient.activate();
    } catch (error) {
      console.error('Failed to initialize WebSocket:', error);
      this.stompClient = null; // Reset on failure
    }
  }

  subscribeToMatch(matchId: number, userId: number): void {
    if (!this.stompClient) {
      console.warn('WebSocket not initialized. Initializing now...');
      this.initializeWebSocket();
    }

    if (!this.connected) {
      console.warn('WebSocket not connected yet. Retrying in 1s for match:', matchId);
      setTimeout(() => this.subscribeToMatch(matchId, userId), 1000);
      return;
    }

    const destination = `/user/${userId}/queue/private-${matchId}`;
    try {
      this.stompClient!.subscribe(destination, (message) => {
        const parsedMessage: ChatMessage = JSON.parse(message.body);
        console.log(`Received message for match ${matchId}:`, parsedMessage);

        if (!this.chatMessagesByMatch.has(matchId)) {
          this.chatMessagesByMatch.set(matchId, []);
        }
        this.chatMessagesByMatch.get(matchId)!.push(parsedMessage);
        this.chatMessageSubject.next({ matchId, message: parsedMessage });
      });
    } catch (error) {
      console.error('Error subscribing to match:', matchId, error);
    }
  }

  sendChatMessage(matchId: number, message: ChatMessage): void {
    if (!this.stompClient || !this.connected) {
      console.error('WebSocket not connected or not initialized. Cannot send message.');
      return;
    }

    try {
      this.stompClient.publish({
        destination: '/app/chat.sendPrivateMessage',
        body: JSON.stringify(message)
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

  getChatMessages(matchId: number): ChatMessage[] {
    return this.chatMessagesByMatch.get(matchId) || [];
  }

  onNewChatMessage(): Observable<{ matchId: number; message: ChatMessage }> {
    return this.chatMessageSubject.asObservable();
  }

  isConnected(): boolean {
    return this.connected;
  }

  disconnect(): void {
    if (this.stompClient) {
      try {
        this.stompClient.deactivate();
        this.stompClient = null;
        this.connected = false;
      } catch (error) {
        console.error('Error disconnecting WebSocket:', error);
      }
    }
  }
}
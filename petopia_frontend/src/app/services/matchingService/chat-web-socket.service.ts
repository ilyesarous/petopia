import { Injectable } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { ChatMessage } from 'src/app/models/matching/chat-message';

@Injectable({
  providedIn: 'root'
})
export class ChatWebSocketService {
  private stompClient: Client | null = null;
  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  private connected = false;
  private currentMatchId: number | null = null;
  private isInitializing = false;
  private subscriptions: { [matchId: number]: string } = {};

  constructor() {
    console.log('ChatWebSocketService instantiated');
  }

  public initializeWebSocket(): void {
    if (this.stompClient) {
      console.log('WebSocket already initialized');
      return;
    }
    if (this.isInitializing) {
      console.log('WebSocket initialization already in progress');
      return;
    }

    this.isInitializing = true;
    try {
      this.stompClient = new Client({
        webSocketFactory: () => {
          const url = 'http://spring-service:7000/petopia/ws';
          console.log('Creating SockJS connection to', url);
          return new SockJS(url);
        },
        connectHeaders: {
          Authorization: localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : ''
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        debug: (str) => console.log('STOMP Debug:', str)
      });

      this.stompClient.onConnect = (frame) => {
        console.log('Chat WebSocket Connected:', frame);
        this.connected = true;
        if (this.currentMatchId) {
          this.subscribeToMatch(this.currentMatchId);
        }
        this.isInitializing = false;
      };

      this.stompClient.onStompError = (error) => {
        console.error('STOMP Error:', error);
        this.connected = false;
        this.isInitializing = false;
      };

      this.stompClient.onWebSocketError = (error) => {
        console.error('WebSocket Error:', error);
        this.connected = false;
        this.isInitializing = false;
      };

      this.stompClient.onWebSocketClose = (event) => {
        console.error('WebSocket Closed:', event);
        this.connected = false;
        this.isInitializing = false;
      };

      this.stompClient.activate();
      console.log('WebSocket activation initiated');
    } catch (error) {
      console.error('Failed to initialize WebSocket:', error);
      this.stompClient = null;
      this.isInitializing = false;
    }
  }

  async subscribeToMatch(matchId: number): Promise<void> {
    this.currentMatchId = matchId;
    if (!this.stompClient) {
      console.warn('WebSocket not initialized. Initializing now...');
      this.initializeWebSocket();
      try {
        await this.waitForConnection();
      } catch (error) {
        console.error('Failed to subscribe: WebSocket not connected', error);
        return;
      }
    }

    if (!this.connected) {
      console.error('WebSocket not connected');
      return;
    }

    if (this.subscriptions[matchId]) {
      console.log(`Unsubscribing from existing subscription for match ${matchId}, subscription ID: ${this.subscriptions[matchId]}`);
      try {
        this.stompClient!.unsubscribe(this.subscriptions[matchId]);
        console.log(`Successfully unsubscribed from match ${matchId}`);
      } catch (error) {
        console.error(`Error unsubscribing from match ${matchId}:`, error);
      }
      delete this.subscriptions[matchId];
    }

    const destination = `/queue/private-${matchId}`;
    try {
      const subscription = this.stompClient!.subscribe(destination, (message: IMessage) => {
        try {
          const parsedMessage: ChatMessage = JSON.parse(message.body);
          console.log(`Received message for match ${matchId} [Message ID: ${message.headers['message-id']}]:`, parsedMessage);
          const currentMessages = this.messagesSubject.value;
          const index = currentMessages.findIndex(msg => msg.id === parsedMessage.id);
          if (index !== -1) {
            // Mettre à jour le message existant
            currentMessages[index] = { ...currentMessages[index], ...parsedMessage };
          } else {
            // Ajouter un nouveau message
            currentMessages.push(parsedMessage);
          }
          this.messagesSubject.next([...currentMessages]);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      });
      this.subscriptions[matchId] = subscription.id;
      console.log(`Subscribed to ${destination}, subscription ID: ${subscription.id}`);
    } catch (error) {
      console.error('Error subscribing to match:', matchId, error);
    }
  }

  private waitForConnection(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.connected) {
        resolve();
        return;
      }
      const maxAttempts = 10;
      let attempts = 0;
      const interval = setInterval(() => {
        if (this.connected) {
          clearInterval(interval);
          resolve();
        } else if (attempts >= maxAttempts) {
          clearInterval(interval);
          reject(new Error('WebSocket connection timeout'));
        }
        attempts++;
      }, 1000);
    });
  }

  async sendChatMessage(message: ChatMessage): Promise<void> {
    if (!this.stompClient) {
      console.warn('WebSocket not initialized. Initializing now...');
      this.initializeWebSocket();
      try {
        await this.waitForConnection();
      } catch (error) {
        console.error('Failed to send message: WebSocket not connected', error);
        return;
      }
    }

    if (!this.connected) {
      console.error('WebSocket not connected');
      return;
    }

    try {
      const userId = localStorage.getItem('userId') ? parseInt(localStorage.getItem('userId')!) : 0;
      const username = localStorage.getItem('username') || 'unknown';
      if (!message.senderId) message.senderId = userId;
      if (!message.sender) message.sender = username;

      this.stompClient?.publish({
        destination: `/app/match/${message.matchId}`,
        body: JSON.stringify(message)
      });
      console.log('Message sent to WebSocket:', message);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

  async sendReaction(messageId: number, matchId: number, reaction: string): Promise<void> {
    if (!this.stompClient || !this.connected) {
      console.warn('WebSocket not initialized or not connected. Initializing now...');
      this.initializeWebSocket();
      try {
        await this.waitForConnection();
      } catch (error) {
        console.error('Failed to send reaction: WebSocket not connected', error);
        return;
      }
    }

    try {
      const userId = localStorage.getItem('userId') ? parseInt(localStorage.getItem('userId')!) : 0;
      const username = localStorage.getItem('username') || 'unknown';

      const reactionMessage: ChatMessage = {
        id: messageId,
        matchId: matchId,
        senderId: userId,
        sender: username,
        content: reaction,
        type: 'REACTION',
        timestamp: new Date().toISOString(),
        receiverId: 0,
        recipient: ''
      };

      this.stompClient?.publish({
        destination: `/app/match/${matchId}/reaction`,
        body: JSON.stringify(reactionMessage)
      });
      console.log('Reaction sent to WebSocket:', reactionMessage);
    } catch (error) {
      console.error('Error sending reaction:', error);
    }
  }

  getMessages(): Observable<ChatMessage[]> {
    return this.messagesSubject.asObservable();
  }

  loadMessages(messages: ChatMessage[]): void {
    console.log('Loading messages:', messages);
    const currentMessages = this.messagesSubject.value;
    // Fusionner les messages pour éviter les duplications
    const updatedMessages = [...currentMessages];
    messages.forEach(newMsg => {
      const index = updatedMessages.findIndex(msg => msg.id === newMsg.id);
      if (index !== -1) {
        updatedMessages[index] = { ...updatedMessages[index], ...newMsg };
      } else {
        updatedMessages.push(newMsg);
      }
    });
    this.messagesSubject.next(updatedMessages);
  }

  isConnected(): boolean {
    return this.connected;
  }

  disconnect(): void {
    if (this.stompClient) {
      try {
        Object.keys(this.subscriptions).forEach((matchId) => {
          this.stompClient!.unsubscribe(this.subscriptions[+matchId]);
          console.log(`Unsubscribed from match ${matchId}`);
        });
        this.subscriptions = {};
        this.stompClient.deactivate();
        console.log('WebSocket deactivated');
      } catch (error) {
        console.error('Error deactivating WebSocket:', error);
      } finally {
        this.stompClient = null;
        this.connected = false;
        this.isInitializing = false;
        this.messagesSubject.next([]);
        console.log('WebSocket disconnected');
      }
    }
  }
}

import { Injectable } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { Notification } from 'src/app/models/matching/notification';

@Injectable({
    providedIn: 'root'
})
export class NotificationMatchService {
    private stompClient: Client | null = null;
    private notificationSubject = new BehaviorSubject<Notification[]>([]);
    private connected = false;
    private isInitializing = false;
    private subscriptionId: string | null = null;
    private notificationBuffer: Notification[] = [];

    constructor() {
        console.log('NotificationMatchService instantiated');
        this.initializeWebSocket();
    }

    public initializeWebSocket(): void {
        if (this.isInitializing) {
            console.log('WebSocket initialization already in progress');
            return;
        }
        if (this.stompClient && this.connected) {
            console.log('WebSocket already initialized and connected');
            return;
        }

        this.isInitializing = true;
        console.time('WebSocketConnection');
        console.log('Initializing WebSocket connection...');
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        console.log('WebSocket - Token:', token ? 'Present' : 'Missing', 'User ID:', userId);

        if (!token || !userId) {
            console.error('Cannot initialize WebSocket: Missing token or userId');
            this.isInitializing = false;
            console.timeEnd('WebSocketConnection');
            return;
        }

        try {
            // Cleanup previous client if exists
            this.disconnect();

            this.stompClient = new Client({
                webSocketFactory: () => {
                    const url = 'http://localhost:8082/petopia/ws';
                    console.log('Creating SockJS connection to:', url);
                    return new SockJS(url);
                },
                connectHeaders: {
                    Authorization: `Bearer ${token}`
                },
                reconnectDelay: 5000,
                heartbeatIncoming: 4000,
                heartbeatOutgoing: 4000,
                debug: (str) => console.log('STOMP Debug:', str)
            });

            this.stompClient.onConnect = (frame) => {
                console.log('Notification WebSocket Connected:', frame);
                console.timeEnd('WebSocketConnection');
                this.connected = true;
                this.isInitializing = false;
                this.subscribeToNotifications();
                // Process buffered notifications with deduplication
                if (this.notificationBuffer.length > 0) {
                    console.log('Processing buffered notifications:', this.notificationBuffer);
                    const currentNotifications = this.notificationSubject.value || [];
                    const uniqueNotifications = this.notificationBuffer.filter(
                        buf => !currentNotifications.some(n => 
                            (n.id === buf.id || n.matchId === buf.matchId) && n.type === buf.type
                        )
                    );
                    this.notificationSubject.next([...currentNotifications, ...uniqueNotifications]);
                    this.notificationBuffer = [];
                }
            };

            this.stompClient.onStompError = (frame) => {
                console.error('STOMP Error:', frame);
                this.connected = false;
                this.isInitializing = false;
                console.log('Will attempt to reconnect in 5 seconds...');
            };

            this.stompClient.onWebSocketError = (error) => {
                console.error('WebSocket Error:', error);
                this.connected = false;
                this.isInitializing = false;
                console.log('Will attempt to reconnect in 5 seconds...');
            };

            this.stompClient.onWebSocketClose = (event) => {
                console.error('WebSocket Closed:', event);
                this.connected = false;
                this.isInitializing = false;
                console.log('Attempting to reconnect in 5 seconds...');
                setTimeout(() => this.initializeWebSocket(), 5000);
            };

            this.stompClient.activate();
            console.log('WebSocket activation initiated');
        } catch (error) {
            console.error('Failed to initialize WebSocket:', error);
            this.stompClient = null;
            this.isInitializing = false;
            console.timeEnd('WebSocketConnection');
            setTimeout(() => this.initializeWebSocket(), 5000);
        }
    }

    subscribeToNotifications(): Promise<void> {
        if (!this.stompClient || !this.connected) {
            console.error('Cannot subscribe: WebSocket not connected. Connection status:', this.connected);
            this.initializeWebSocket();
            return Promise.resolve();
        }
        console.log('WebSocket is connected, subscribing to notifications...');

        const userId = this.getUserId();
        if (!userId) {
            console.error('Cannot subscribe: No user ID available');
            return Promise.resolve();
        }

        // Cleanup existing subscription
        if (this.subscriptionId) {
            try {
                this.stompClient.unsubscribe(this.subscriptionId);
                console.log(`Unsubscribed from previous subscription ID: ${this.subscriptionId}`);
            } catch (error) {
                console.error('Error unsubscribing:', error);
            }
            this.subscriptionId = null;
        }

        const destination = `/user/${userId}/queue/notifications`;
        console.time('WebSocketSubscription');
        console.log('Subscribing to:', destination);
        try {
            const subscription = this.stompClient.subscribe(destination, (message: IMessage) => {
                console.log('Received WebSocket message [Message ID: ' + message.headers['message-id'] + ']:', message.body);
                try {
                    const notification: Notification = JSON.parse(message.body);
                    // Ensure consistent ID
                    if (!notification.id) {
                        notification.id = `match-accept-${String(notification.matchId)}`;
                    }
                    notification.timestamp = notification.timestamp ? new Date(notification.timestamp) : new Date();
                    console.log('Parsed notification:', notification);
                    const currentNotifications = this.notificationSubject.value || [];
                    // Deduplicate by id or matchId and type
                    if (!currentNotifications.some(n => 
                        (n.id === notification.id || n.matchId === notification.matchId) && n.type === notification.type
                    )) {
                        currentNotifications.push(notification);
                        this.notificationSubject.next([...currentNotifications]);
                        console.log('Emitted notifications:', currentNotifications);
                    } else {
                        console.log('Duplicate notification ignored:', notification);
                    }
                } catch (error) {
                    console.error('Error parsing notification:', error, 'Raw body:', message.body);
                }
            });
            this.subscriptionId = subscription.id;
            console.log(`Subscribed to ${destination}, subscription ID: ${subscription.id}`);
            console.timeEnd('WebSocketSubscription');
        } catch (error) {
            console.error('Error subscribing to notifications:', error);
            this.subscriptionId = null;
            setTimeout(() => this.subscribeToNotifications(), 500);
        }
        return Promise.resolve();
    }

    private getUserId(): string {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            console.error('No user ID found in localStorage');
            return '';
        }
        console.log('Using user ID for WebSocket subscription:', userId);
        return userId;
    }

    getNotifications(): Observable<Notification[]> {
        console.log('Returning notifications observable:', this.notificationSubject.value);
        return this.notificationSubject.asObservable();
    }

    async sendNotification(notification: Notification): Promise<void> {
        if (!this.stompClient) {
            console.warn('WebSocket not initialized. Initializing now...');
            this.initializeWebSocket();
            try {
                await new Promise<void>((resolve, reject) => {
                    const maxAttempts = 5;
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
            } catch (error) {
                console.error('Failed to send notification: WebSocket not connected', error);
                return;
            }
        }

        if (!this.connected) {
            console.error('WebSocket not connected');
            return;
        }

        try {
            this.stompClient?.publish({
                destination: `/app/notify`,
                body: JSON.stringify(notification)
            });
            console.log('Notification sent to WebSocket:', notification);
        } catch (error) {
            console.error('Error sending notification:', error);
        }
    }

    isConnected(): boolean {
        return this.connected;
    }

    disconnect(): void {
        if (this.stompClient) {
            try {
                if (this.subscriptionId) {
                    this.stompClient.unsubscribe(this.subscriptionId);
                    console.log(`Unsubscribed from notifications, subscription ID: ${this.subscriptionId}`);
                    this.subscriptionId = null;
                }
                this.stompClient.deactivate();
                console.log('WebSocket deactivated');
            } catch (error) {
                console.error('Error deactivating WebSocket:', error);
            } finally {
                this.stompClient = null;
                this.connected = false;
                this.isInitializing = false;
                console.log('WebSocket disconnected');
            }
        }
        this.notificationBuffer = [];
    }

   
}
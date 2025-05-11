// websocket.service.ts
import { Injectable } from '@angular/core';
import { Stomp } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private stompClient: any;
  private petCodeSubject = new Subject<number>();


  private baseUrl = 'http://petopia.local:31158/petopia';


  constructor(private router: Router) { }

  connect() {
    const socket = new SockJS(`${this.baseUrl}/ws`);
    this.stompClient = Stomp.over(socket);
    
    this.stompClient.connect({}, () => {
      this.stompClient.subscribe('/topic/pet-code', (message: any) => {
        const content = JSON.parse(message.body);
        if (content.type === 'PET_CODE_ENTERED') {
          this.router.navigate([`/vet/pet-growth/${content.petId}`]);
        }
      });
    });
  }

  onPetCodeEntered() {
    return this.petCodeSubject.asObservable();
  }

  disconnect() {
    if (this.stompClient) {
      this.stompClient.disconnect();
    }
  }
}
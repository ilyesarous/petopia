import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationStateService {

  constructor() { }

  private showNotificationsSubject = new Subject<boolean>();
  
  showNotifications$ = this.showNotificationsSubject.asObservable();
  
  toggleNotifications(show: boolean) {
    this.showNotificationsSubject.next(show);
  }
}

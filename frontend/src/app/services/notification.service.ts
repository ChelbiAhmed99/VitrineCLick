import { Injectable, NgZone } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private eventSource: EventSource | null = null;
  private notificationSubject = new Subject<any>();

  constructor(private authService: AuthService, private zone: NgZone) { }

  connect() {
    if (this.eventSource) {
      this.eventSource.close();
    }

    const token = this.authService.getToken();
    if (!token) return;
    
    this.eventSource = new EventSource(`http://localhost:8080/api/notifications/stream?token=${token}`);

    this.eventSource.addEventListener('notification', (event: any) => {
      this.zone.run(() => {
        const data = JSON.parse(event.data);
        this.notificationSubject.next(data);
      });
    });

    this.eventSource.onerror = (error) => {
      console.error('SSE Error:', error);
      this.eventSource?.close();
    };
  }

  getNotifications(): Observable<any> {
    return this.notificationSubject.asObservable();
  }

  disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }
}

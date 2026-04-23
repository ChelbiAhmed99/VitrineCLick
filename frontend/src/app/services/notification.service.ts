import { Injectable, NgZone } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private eventSource: EventSource | null = null;
  private notificationSubject = new Subject<any>();

  private reconnectTimeout: any = null;
  private reconnectDelay = 5000;

  constructor(private authService: AuthService, private zone: NgZone) { }

  connect() {
    if (this.eventSource) {
      this.eventSource.close();
    }

    const token = this.authService.getToken();
    if (!token) return;
    
    console.log('SSE: Connecting...');
    this.eventSource = new EventSource(`http://localhost:8080/api/notifications/stream?token=${token}`);

    this.eventSource.addEventListener('notification', (event: any) => {
      this.zone.run(() => {
        try {
          const data = JSON.parse(event.data);
          this.notificationSubject.next(data);
        } catch (e) {
          console.error('SSE: Data parse error', e);
        }
      });
    });

    this.eventSource.addEventListener('SITE_UPDATE', (event: any) => {
      this.zone.run(() => {
        const data = JSON.parse(event.data);
        this.notificationSubject.next({ type: 'SITE_UPDATE', ...data });
      });
    });

    this.eventSource.onopen = () => {
      console.log('SSE: Connection established');
      this.reconnectDelay = 5000; // Reset delay on success
    };

    this.eventSource.onerror = (error) => {
      console.error('SSE Error:', error);
      this.disconnect();
      
      // Automatic reconnection
      if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = setTimeout(() => {
        console.log(`SSE: Attempting reconnection after ${this.reconnectDelay}ms...`);
        this.connect();
        // Exponential backoff
        this.reconnectDelay = Math.min(this.reconnectDelay * 2, 60000);
      }, this.reconnectDelay);
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
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
  }
}


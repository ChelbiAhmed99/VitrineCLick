import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

const API_URL = `${environment.apiUrl}/auth/`;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<any>(null);
  public user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {
    const user = localStorage.getItem('user');
    if (user) {
      this.userSubject.next(JSON.parse(user));
    }
  }

  login(credentials: any): Observable<any> {
    return this.http.post(API_URL + 'signin', credentials).pipe(
      tap((user: any) => {
        if (user && user.token) {
          localStorage.setItem('user', JSON.stringify(user));
          this.userSubject.next(user);
        }
      })
    );
  }

  register(userData: any, plan?: string): Observable<any> {
    const payload = { ...userData };
    if (plan) payload.plan = plan;
    return this.http.post(API_URL + 'signup', payload);
  }

  logout() {
    localStorage.removeItem('user');
    this.userSubject.next(null);
  }

  syncUser(): Observable<any> {
    return this.http.get(API_URL + 'me').pipe(
      tap((user: any) => {
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        const updatedUser = { ...currentUser, ...user };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        this.userSubject.next(updatedUser);
      })
    );
  }

  getToken() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user?.token;
  }

  getUserRoles(): string[] {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user?.roles || [];
  }

  isAdmin(): boolean {
    return this.getUserRoles().includes('ROLE_ADMIN');
  }

  isClient(): boolean {
    return this.getUserRoles().includes('ROLE_CLIENT');
  }
}

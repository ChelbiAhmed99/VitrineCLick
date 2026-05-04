import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

const API_URL = `${environment.apiUrl}/sites`;

@Injectable({
  providedIn: 'root'
})
export class SiteService {
  constructor(private http: HttpClient, private authService: AuthService) {}
  private get headers() {
    return new HttpHeaders({
      'Authorization': 'Bearer ' + this.authService.getToken()
    });
  }

  getSites(): Observable<any> {
    return this.http.get(API_URL, { headers: this.headers });
  }

  createSite(siteData: any): Observable<any> {
    return this.http.post(API_URL, siteData, { headers: this.headers });
  }

  updateSite(id: number, siteData: any): Observable<any> {
    return this.http.put(`${API_URL}/${id}`, siteData, { headers: this.headers });
  }

  deleteSite(id: number): Observable<any> {
    return this.http.delete(`${API_URL}/${id}`, { headers: this.headers });
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private API = `${environment.apiBaseUrl}/api/auth`;

  constructor(private http: HttpClient) {}

  logout(): Observable<any> {
    console.log('AuthService.logout() called, endpoint:', `${this.API}/logout`);
    return this.http.post(`${this.API}/logout`, {});
  }
}

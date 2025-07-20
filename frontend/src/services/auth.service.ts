import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

const AUTH_TOKEN: string = 'auth_token';
const API_BASE_URL: string = `${environment.backendUrl}/auth`

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(private http: HttpClient) {}

  login(pin: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${API_BASE_URL}/login`, { pin });
  }

  setAuthToken(token: string): void {
    localStorage.setItem(AUTH_TOKEN, token);
  }

  getAuthToken(): string | null {
    return localStorage.getItem(AUTH_TOKEN);
  }

  removeAuthToken(): void {
    localStorage.removeItem(AUTH_TOKEN);
  }
}

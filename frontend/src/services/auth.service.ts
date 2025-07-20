import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  static AUTH_TOKEN: string = 'auth_token';

  constructor(private http: HttpClient) {}

  login(pin: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>('/api/login', { pin });
  }

  setAuthToken(token: string): void {
    localStorage.setItem(AuthService.AUTH_TOKEN, token);
  }

  getAuthToken(): string | null {
    return localStorage.getItem(AuthService.AUTH_TOKEN);
  }

  removeAuthToken(): void {
    localStorage.removeItem(AuthService.AUTH_TOKEN);
  }
}

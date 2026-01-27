import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly STORAGE_KEY = 'mlc_user';
  private readonly DUMMY = { username: 'admin', password: 'password123' };

  login(username: string, password: string): boolean {
    if (username === this.DUMMY.username && password === this.DUMMY.password) {
      localStorage.setItem(this.STORAGE_KEY, username);
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.STORAGE_KEY);
  }

  getUsername(): string | null {
    return localStorage.getItem(this.STORAGE_KEY);
  }
}

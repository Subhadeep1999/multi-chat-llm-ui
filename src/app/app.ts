import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { ToastComponent } from './shared/components/toast/toast.component';
import { LogoutConfirmComponent } from './shared/components/logout-confirm/logout-confirm.component';
import { ToastService } from './core/services/toast.service';
import { AuthService } from './core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ToastComponent, LogoutConfirmComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  appName = 'Multi-LLM Chat';
  showLogoutConfirm = false;
  isLoginRoute = false;
  constructor(private router: Router, private auth: AuthService) {
    this.router.events.subscribe(() => {
      this.isLoginRoute = this.router.url === '/' || this.router.url.startsWith('/login');
    });
    // Set initial value
    this.isLoginRoute = this.router.url === '/' || this.router.url.startsWith('/login');
    console.log('AppComponent constructed, AuthService:', !!auth);
  }

  logout() {
    console.log('Logout clicked');
    this.auth.logout().subscribe({
      next: () => {
        localStorage.removeItem('access_token');
        this.showLogoutConfirm = false;
        this.router.navigate(['/']);
      },
      error: () => {
        localStorage.removeItem('access_token');
        this.showLogoutConfirm = false;
        this.router.navigate(['/']);
      }
    });
  }
}

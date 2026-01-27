import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { ToastComponent } from './shared/components/toast/toast.component';
import { AuthService } from './core/services/auth.service';
import { LogoutConfirmComponent } from './shared/components/logout-confirm/logout-confirm.component';
import { ToastService } from './core/services/toast.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastComponent, LogoutConfirmComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  appName = 'Multi-LLM Chat';
  showLogoutConfirm = false;

  constructor(public auth: AuthService, private router: Router, private toast: ToastService) {}

  logout() {
    // show confirmation modal
    this.showLogoutConfirm = true;
    this.goLogin();
  }

  goLogin() {
    this.router.navigate(['/login']);
    this.auth.logout();
  }

  performLogout() {
    this.showLogoutConfirm = false;
    this.auth.logout();
    this.toast.show('You have been logged out', 'info');
    this.router.navigate(['/login']);
  }
}

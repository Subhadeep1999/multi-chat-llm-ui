import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { ToastComponent } from './shared/components/toast/toast.component';
// import { AuthService } from './core/services/auth.service';
// import { LogoutConfirmComponent } from './shared/components/logout-confirm/logout-confirm.component';
import { ToastService } from './core/services/toast.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  appName = 'Multi-LLM Chat';
  constructor() {}
}

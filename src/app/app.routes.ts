import { Routes } from '@angular/router';
import { ChatComponent } from './pages/chat/chat.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './core/services/auth.guard';
import { GoogleCallbackComponent } from './pages/login/google-callback.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'chat', component: ChatComponent, canActivate: [AuthGuard] },
  { path: 'auth/google/callback', loadComponent: () => import('./pages/login/google-callback.component').then(m => m.GoogleCallbackComponent) },
];

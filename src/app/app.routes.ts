import { Routes } from '@angular/router';
import { ChatComponent } from './pages/chat/chat.component';
// import { LoginComponent } from './pages/login/login.component';
// import { AuthGuard } from './core/services/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'chat', pathMatch: 'full' },
  { path: 'chat', component: ChatComponent },
];

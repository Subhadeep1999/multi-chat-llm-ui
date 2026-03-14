import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from '../register/register.component';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RegisterComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  form: FormGroup;
  error: string = '';
  loading = false;
  showRegister = false;
  showPassword = false;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';
    this.http.post<any>('/api/auth/login', this.form.value).subscribe({
      next: (res) => {
        localStorage.setItem('access_token', res.access_token);
        this.router.navigate(['/chat']);
      },
      error: (err) => {
        this.error = err.error?.detail || 'Login failed';
        this.loading = false;
      }
    });
  }

  toggleRegister() {
    this.showRegister = !this.showRegister;
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  loginWithGoogle() {
    const clientId = environment.googleClientId;
    const nonce = Math.random().toString(36).substring(2);
    window.location.href =
      'https://accounts.google.com/o/oauth2/v2/auth?client_id=' +
      encodeURIComponent(clientId) +
      '&redirect_uri=' + encodeURIComponent(window.location.origin + '/auth/google/callback') +
      '&response_type=id_token token' +
      '&scope=openid%20email%20profile' +
      '&nonce=' + nonce;
  }
}

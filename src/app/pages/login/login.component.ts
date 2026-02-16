import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseAuthService } from '../../core/services/firebase-auth.service';

declare const google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements AfterViewInit {
  form!: FormGroup;
  isRegister = false;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private auth: FirebaseAuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  toggleMode() {
    this.isRegister = !this.isRegister;
  }

  submit() {
    if (this.form.invalid || this.loading) return;
    this.loading = true;
    const { email, password } = this.form.value;
    if (this.isRegister) {
      this.auth.register(email, password).subscribe({
        next: () => {
          this.isRegister = false;
          this.loading = false;
        },
        error: err => {
          alert(err?.message || 'Registration failed');
          this.loading = false;
        }
      });
    } else {
      this.auth.login(email, password).subscribe({
        next: () => this.router.navigate(['/chat']),
        error: err => {
          alert(err?.message || 'Authentication failed');
          this.loading = false;
        },
        complete: () => (this.loading = false)
      });
    }
  }

  ngAfterViewInit() {
    // Optionally, you can use Google button from Firebase UI or your own button
    // For now, just add a click handler for Google login
    const btn = document.getElementById('google-btn');
    if (btn) {
      btn.innerHTML = '<button class="login-btn" style="width:100%">Sign in with Google</button>';
      btn.onclick = () => {
        this.loading = true;
        this.auth.loginWithGoogle().subscribe({
          next: () => this.router.navigate(['/chat']),
          error: () => {
            alert('Google login failed');
            this.loading = false;
          },
          complete: () => (this.loading = false)
        });
      };
    }
  }
}

import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// import { AuthService } from '../../core/services/auth.service';

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
    // private auth: AuthService,
    private router: Router
  ) {
    // ✅ SAFE initialization
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

    // if (this.isRegister) {
    //   this.auth.register(email!, password!).subscribe({
    //     next: () => {
    //       // After registration, switch to sign in mode
    //       this.isRegister = false;
    //       this.loading = false;
    //     },
    //     error: err => {
    //       alert(err?.error?.detail || 'Registration failed');
    //       this.loading = false;
    //     }
    //   });
    // } else {
    //   this.auth.login(email!, password!).subscribe({
    //     next: () => this.router.navigate(['/chat']),
    //     error: err => {
    //       alert(err?.error?.detail || 'Authentication failed');
    //       this.loading = false;
    //     },
    //     complete: () => (this.loading = false)
    //   });
    // }
  }

  // ---------------- GOOGLE SIGN-IN ----------------
  ngAfterViewInit() {
    // google.accounts.id.initialize({
    //   client_id: 'YOUR_GOOGLE_CLIENT_ID',
    //   callback: (resp: any) => this.onGoogle(resp)
    // });

    google.accounts.id.renderButton(
      document.getElementById('google-btn'),
      { theme: 'outline', size: 'large' }
    );
  }

  // onGoogle(resp: any) {
  //   this.auth.googleLogin(resp.credential).subscribe({
  //     next: () => this.router.navigate(['/chat']),
  //     error: () => alert('Google login failed')
  //   });
  // }
}

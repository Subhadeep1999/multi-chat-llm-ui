import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  form: FormGroup;


  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private toast: ToastService
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  submit() {
    if (this.form.invalid) {
      this.toast.show('Please enter both username and password.', 'error');
      return;
    }
    const { username, password } = this.form.value;
    if (this.auth.login(username.trim(), password)) {
      this.toast.show(`Welcome, ${username}!`, 'success');
      this.router.navigate(['/chat']);
    } else {
      this.toast.show('Invalid credentials. Try username: admin / password: password123', 'error', 5000);
    }
  }
}

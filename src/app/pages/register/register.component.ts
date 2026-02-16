import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  form: FormGroup;
  error: string = '';
  loading = false;
  showPassword = false;
  showConfirmPassword = false;
  @Output() registered = new EventEmitter<void>();

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  submit() {
    if (this.form.invalid || this.form.value.password !== this.form.value.confirmPassword) {
      this.error = "Passwords do not match";
      return;
    }
    this.loading = true;
    this.error = '';
    this.http.post<any>('/api/auth/register', {
      email: this.form.value.email,
      password: this.form.value.password
    }).subscribe({
      next: () => {
        this.registered.emit();
      },
      error: (err) => {
        this.error = err.error?.detail || 'Registration failed';
        this.loading = false;
      }
    });
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }
  toggleShowConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}

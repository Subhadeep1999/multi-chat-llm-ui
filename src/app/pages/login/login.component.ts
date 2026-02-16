import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseAuthService } from '../../core/services/firebase-auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {

  loading = false;
  errorMsg = '';
  isRegister = false;
 form:FormGroup;
  constructor(
    private fb: FormBuilder,
    private authService: FirebaseAuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  toggleMode() {
    this.isRegister = !this.isRegister;
    this.errorMsg = '';
  }

  submit() {
    if (this.form.invalid) return;

    const { email, password } = this.form.value;
    this.loading = true;

    if (this.isRegister) {
      this.authService.register(email!, password!)
        .then(() => this.router.navigate(['/chat']))
        .catch(err => this.errorMsg = err.message)
        .finally(() => this.loading = false);
    } else {
      this.authService.login(email!, password!)
        .then(() => this.router.navigate(['/chat']))
        .catch(err => this.errorMsg = err.message)
        .finally(() => this.loading = false);
    }
  }

  googleLogin() {
    this.loading = true;

    this.authService.loginWithGoogle()
      .then(() => this.router.navigate(['/chat']))
      .catch(err => this.errorMsg = err.message)
      .finally(() => this.loading = false);
  }
}

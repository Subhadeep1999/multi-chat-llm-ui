import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-google-callback',
  standalone: true,
  template: `<div>Signing in with Google...</div>`
})
export class GoogleCallbackComponent implements OnInit {
  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    // Parse id_token and access_token from URL fragment
    const hash = window.location.hash.substr(1);
    const params = new URLSearchParams(hash);
    const idToken = params.get('id_token');
    // Optionally, you can also get access_token if needed:
    // const accessToken = params.get('access_token');
    if (idToken) {
      // Send id_token to backend for verification and login
      this.http.post<any>('/api/auth/google', { id_token: idToken }).subscribe({
        next: (res) => {
          localStorage.setItem('access_token', res.access_token);
          this.router.navigate(['/chat']);
        },
        error: () => {
          this.router.navigate(['/']);
        }
      });
    } else {
      this.router.navigate(['/']);
    }
  }
}

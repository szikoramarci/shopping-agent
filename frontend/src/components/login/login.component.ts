// pin-login.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  pin = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    if (this.pin.length < 6) {
      this.error = 'A PIN túl rövid.';
      return;
    }

    this.authService.login(this.pin).subscribe({
      next: (res) => {
        localStorage.setItem('auth_token', res.token);
        this.error = '';
        this.router.navigateByUrl('/voice');
      },
      error: (err) => {
        console.error('Login error', err);
        this.error = 'Hibás PIN vagy hiba történt a bejelentkezéskor.';
      },
    });
  }
}

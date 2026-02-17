import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="row justify-content-center mt-5">
      <div class="col-md-6 col-lg-4">
        <div class="card">
          <div class="card-header bg-primary text-white text-center">
            <h4>Login</h4>
          </div>
          <div class="card-body">
            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input type="email" id="email" class="form-control" formControlName="email" 
                       [class.is-invalid]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched">
                <div class="invalid-feedback">Valid email is required</div>
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input type="password" id="password" class="form-control" formControlName="password" required>
              </div>
              <div class="d-grid">
                <button type="submit" class="btn btn-primary" [disabled]="loginForm.invalid || loading">
                  {{ loading ? 'Logging in...' : 'Login' }}
                </button>
              </div>
              <div *ngIf="error" class="alert alert-danger mt-3">
                {{ error }}
              </div>
            </form>
          </div>
          <div class="card-footer text-muted text-center">
             <small>Default Users:<br>
             admin&#64;example.com / admin123<br>
             user&#64;example.com / user123</small>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.error = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.router.navigate(['/orders']);
      },
      error: (err) => {
        this.error = 'Invalid email or password';
        this.loading = false;
      }
    });
  }
}

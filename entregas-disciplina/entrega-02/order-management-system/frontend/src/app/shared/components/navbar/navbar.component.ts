import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container">
        <a class="navbar-brand" routerLink="/">OrderSystem</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item" *ngIf="isLoggedIn">
              <a class="nav-link" routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
            </li>
            <li class="nav-item" *ngIf="isLoggedIn">
              <a class="nav-link" routerLink="/orders" routerLinkActive="active">Orders</a>
            </li>
            <li class="nav-item" *ngIf="showCreateOrder">
              <a class="nav-link" routerLink="/orders/create">New Order</a>
            </li>
          </ul>
          <ul class="navbar-nav">
             <li class="nav-item" *ngIf="!isLoggedIn">
              <a class="nav-link" routerLink="/login">Login</a>
            </li>
            <li class="nav-item" *ngIf="isLoggedIn">
               <span class="nav-link text-light me-2">{{ userEmail }}</span>
            </li>
            <li class="nav-item" *ngIf="isLoggedIn">
              <a class="nav-link" href="#" (click)="logout($event)">Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {

  constructor(public authService: AuthService, private router: Router) { }

  get isLoggedIn(): boolean {
    return !!this.authService.getUser();
  }

  get userEmail(): string {
    return this.authService.getUser()?.email || '';
  }

  get showCreateOrder(): boolean {
    return this.authService.hasRole('ROLE_USER') || this.authService.hasRole('ROLE_ADMIN');
  }

  logout(event: Event) {
    event.preventDefault();
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

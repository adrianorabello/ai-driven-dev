import { Routes } from '@angular/router';
import { LoginComponent } from './modules/auth/login.component';
import { OrderListComponent } from './modules/orders/order-list.component';
import { OrderCreateComponent } from './modules/orders/order-create.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
    { path: 'orders', component: OrderListComponent, canActivate: [authGuard] },
    { path: 'orders/create', component: OrderCreateComponent, canActivate: [authGuard] },
    { path: 'orders/edit/:id', component: OrderCreateComponent, canActivate: [authGuard] },
    { path: '**', redirectTo: '/login' }
];

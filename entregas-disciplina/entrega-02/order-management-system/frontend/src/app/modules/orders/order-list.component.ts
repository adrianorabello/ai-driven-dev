import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { OrderService } from '../../core/services/order.service';
import { AuthService } from '../../core/services/auth.service';
import { Order, OrderStatus } from '../../shared/models/models';
import { inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2 class="mb-4">Orders</h2>
    
    <div *ngIf="loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div *ngIf="!loading && orders.length === 0" class="alert alert-info shadow-sm">
      <i class="bi bi-info-circle me-2"></i> No orders found.
    </div>

    <div class="card shadow-sm border-0" *ngIf="!loading && orders.length > 0">
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table table-hover mb-0">
            <thead class="table-light">
              <tr>
                <th class="border-top-0">ID</th>
                <th class="border-top-0">Date</th>
                <th class="border-top-0">User</th>
                <th class="border-top-0">Items</th>
                <th class="border-top-0">Total</th>
                <th class="border-top-0">Status</th>
                <th class="border-top-0 text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let order of orders">
                <td class="align-middle fw-bold">#{{ order.id }}</td>
                <td class="align-middle">{{ order.createdAt | date:'mediumDate' }}</td>
                <td class="align-middle">{{ order.userEmail }}</td>
                <td class="align-middle">
                    <span class="badge bg-light text-dark border">{{ order.items.length || 0 }} items</span>
                </td>
                <td class="align-middle">{{ order.total | currency }}</td>
                <td class="align-middle">
                  <span class="badge rounded-pill" [ngClass]="getStatusClass(order.status)">
                    {{ order.status }}
                  </span>
                </td>
                <td class="align-middle text-end">
                  <div *ngIf="isAdmin || order.status === 'OPEN'">
                    <ng-container *ngIf="isAdmin">
                        <button class="btn btn-sm btn-outline-success me-1" 
                            *ngIf="order.status === 'OPEN'"
                            title="Confirm"
                            (click)="updateStatus(order.id, 'CONFIRMED')"><i class="bi bi-check-lg"></i></button>
                        
                        <button class="btn btn-sm btn-outline-primary me-1" 
                            *ngIf="order.status === 'CONFIRMED'"
                            title="Ship"
                            (click)="updateStatus(order.id, 'SHIPPED')"><i class="bi bi-truck"></i></button>
                        
                        <button class="btn btn-sm btn-outline-success me-1" 
                            *ngIf="order.status === 'SHIPPED'"
                            title="Deliver"
                            (click)="updateStatus(order.id, 'DELIVERED')"><i class="bi bi-box-seam"></i></button>

                        <button class="btn btn-sm btn-outline-danger me-1" 
                            *ngIf="order.status === 'OPEN'"
                            title="Cancel"
                            (click)="updateStatus(order.id, 'CANCELED')"><i class="bi bi-x-lg"></i></button>
                    </ng-container>

                    <button class="btn btn-sm btn-outline-secondary me-1" 
                        *ngIf="order.status === 'OPEN'"
                        title="Edit"
                        (click)="editOrder(order.id)">
                        <i class="bi bi-pencil"></i>
                    </button>

                    <button class="btn btn-sm btn-outline-danger" 
                        *ngIf="order.status === 'OPEN'"
                        title="Delete"
                        (click)="deleteOrder(order.id)">
                        <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class OrderListComponent implements OnInit {
  orders: Order[] = [];
  loading = false;
  isAdmin = false;
  private destroyRef = inject(DestroyRef);

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) {
    this.isAdmin = this.authService.hasRole('ROLE_ADMIN');
  }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    this.loading = true;
    this.orderService.getOrders()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
      next: (data) => {
        this.orders = data.content;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  updateStatus(id: number, status: string) {
    this.orderService.updateStatus(id, status as OrderStatus)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
      next: () => {
        this.loadOrders();
      }
    });
  }

  deleteOrder(id: number) {
    if (confirm('Are you sure you want to delete this order?')) {
      this.orderService.deleteOrder(id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
        next: () => {
          this.loadOrders();
        },
        error: (err) => {
          alert('Failed to delete order');
        }
      });
    }
  }

  editOrder(id: number) {
    this.router.navigate(['/orders/edit', id]);
  }

  getStatusClass(status: OrderStatus): string {
    switch (status) {
      case OrderStatus.OPEN: return 'bg-primary';
      case OrderStatus.CONFIRMED: return 'bg-info';
      case OrderStatus.SHIPPED: return 'bg-warning text-dark';
      case OrderStatus.DELIVERED: return 'bg-success';
      case OrderStatus.CANCELED: return 'bg-danger';
      default: return 'bg-secondary';
    }
  }
}

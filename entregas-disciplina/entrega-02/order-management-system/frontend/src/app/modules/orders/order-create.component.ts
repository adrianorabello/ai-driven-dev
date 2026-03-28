import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { OrderService } from '../../core/services/order.service';
import { Product, Order } from '../../shared/models/models';
import { OrderFormService } from './order-form.service';

@Component({
  selector: 'app-order-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container mt-4">
      <div class="card shadow-sm border-0">
        <div class="card-header bg-white border-bottom-0 pt-4 pb-0">
            <h2 class="mb-0">{{ isEditMode ? 'Edit Order #' + orderId : 'Create New Order' }}</h2>
        </div>
        <div class="card-body">
            <div *ngIf="!products.length" class="alert alert-warning">
            <div class="spinner-border spinner-border-sm me-2" role="status"></div>
            Loading products...
            </div>

            <form [formGroup]="orderForm" (ngSubmit)="onSubmit()" *ngIf="products.length">
            <div formArrayName="items">
                <div *ngFor="let item of items.controls; let i=index" [formGroupName]="i" class="card mb-3 bg-light border-0">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h5 class="card-title mb-0">Item #{{ i + 1 }}</h5>
                        <button type="button" class="btn btn-outline-danger btn-sm" (click)="removeItem(i)" [disabled]="items.length === 1">
                            <i class="bi bi-trash"></i> Remove
                        </button>
                    </div>
                    <div class="row">
                    <div class="col-md-7 mb-3">
                        <label class="form-label">Product</label>
                        <select class="form-select" formControlName="productId">
                            <option [ngValue]="null" disabled>Select a product</option>
                            <option *ngFor="let product of products" [ngValue]="product.id">
                                {{ product.name }} - {{ product.price | currency }}
                            </option>
                        </select>
                    </div>
                    <div class="col-md-5 mb-3">
                        <label class="form-label">Quantity</label>
                        <input type="number" class="form-control" formControlName="quantity" min="1">
                    </div>
                    </div>
                </div>
                </div>
            </div>
            
            <div class="d-flex justify-content-between mt-4">
                <button type="button" class="btn btn-outline-secondary" (click)="addItem()">
                    <i class="bi bi-plus-lg"></i> Add Item
                </button>
                <div>
                    <button type="button" class="btn btn-light me-2" (click)="cancel()">Cancel</button>
                    <button type="submit" class="btn btn-primary px-4" [disabled]="orderForm.invalid || loading">
                        {{ loading ? 'Saving...' : (isEditMode ? 'Update Order' : 'Place Order') }}
                    </button>
                </div>
            </div>
            </form>
        </div>
      </div>
    </div>
  `
})
export class OrderCreateComponent implements OnInit {
  orderForm: FormGroup;
  products: Product[] = [];
  loading = false;
  isEditMode = false;
  orderId: number | null = null;
  private destroyRef = inject(DestroyRef);

  constructor(
    private orderFormService: OrderFormService,
    private orderService: OrderService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.orderForm = this.orderFormService.createOrderForm();
  }

  ngOnInit(): void {
    this.orderService.getProducts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (products) => {
          this.products = products;
          this.route.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
            if (params['id']) {
              this.isEditMode = true;
              this.orderId = +params['id'];
              this.loadOrder(this.orderId);
            } else {
              this.addItem();
            }
          });
        },
        error: (err) => console.error('Error loading products:', err)
      });
  }

  loadOrder(id: number) {
    this.loading = true;
    this.orderService.getOrder(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (order: Order) => {
          this.loading = false;
          const itemsToLoad = order.items.map((item: any) => ({
            productId: item.productId || (item as any).product?.id,
            quantity: item.quantity
          }));
          this.orderFormService.loadOrderItems(this.orderForm, itemsToLoad);
        },
        error: (err) => {
          console.error('Failed to load order:', err);
          this.loading = false;
          alert('Failed to load order');
          this.router.navigate(['/orders']);
        }
      });
  }

  get items() {
    return this.orderFormService.itemsArray(this.orderForm);
  }

  addItem() {
    this.orderFormService.addItem(this.orderForm);
  }

  removeItem(index: number) {
    this.orderFormService.removeItem(this.orderForm, index);
  }

  cancel() {
    this.router.navigate(['/orders']);
  }

  onSubmit() {
    if (this.orderForm.invalid) return;

    this.loading = true;
    const payload = this.orderFormService.getPayload(this.orderForm);

    if (this.isEditMode && this.orderId) {
      this.orderService.updateOrder(this.orderId, payload)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => this.router.navigate(['/orders']),
          error: () => {
            this.loading = false;
            alert('Error updating order');
          }
        });
    } else {
      this.orderService.createOrder(payload)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => this.router.navigate(['/orders']),
          error: () => {
            this.loading = false;
            alert('Error creating order');
          }
        });
    }
  }
}

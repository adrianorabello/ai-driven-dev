import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrderItemRequest } from '../../shared/models/models';

@Injectable({
  providedIn: 'root'
})
export class OrderFormService {
  constructor(private fb: FormBuilder) {}

  createOrderForm(): FormGroup {
    return this.fb.group({
      items: this.fb.array([])
    });
  }

  itemsArray(form: FormGroup): FormArray {
    return form.get('items') as FormArray;
  }

  addItem(form: FormGroup): void {
    const itemForm = this.fb.group({
      productId: [null, Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });
    this.itemsArray(form).push(itemForm);
  }

  removeItem(form: FormGroup, index: number): void {
    this.itemsArray(form).removeAt(index);
  }

  clearItems(form: FormGroup): void {
    const arr = this.itemsArray(form);
    while (arr.length) {
      arr.removeAt(0);
    }
  }

  loadOrderItems(form: FormGroup, items: any[]): void {
    this.clearItems(form);
    if (items && items.length > 0) {
      items.forEach(item => {
        const pId = item.productId;
        const itemForm = this.fb.group({
          productId: [pId, Validators.required],
          quantity: [item.quantity, [Validators.required, Validators.min(1)]]
        });
        this.itemsArray(form).push(itemForm);
      });
    } else {
      this.addItem(form);
    }
  }

  getPayload(form: FormGroup): OrderItemRequest[] {
    return form.value.items as OrderItemRequest[];
  }
}

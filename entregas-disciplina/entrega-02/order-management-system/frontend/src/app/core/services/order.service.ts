import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, OrderStatus, Product, OrderItemRequest, Page } from '../../shared/models/models';

import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    getOrders(page: number = 0, size: number = 10): Observable<Page<Order>> {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('size', size.toString());
        return this.http.get<Page<Order>>(`${this.apiUrl}/orders`, { params });
    }

    createOrder(items: OrderItemRequest[]): Observable<Order> {
        return this.http.post<Order>(`${this.apiUrl}/orders`, { items });
    }

    updateOrder(id: number, items: OrderItemRequest[]): Observable<Order> {
        return this.http.put<Order>(`${this.apiUrl}/orders/${id}`, { items });
    }

    getOrder(id: number): Observable<Order> {
        return this.http.get<Order>(`${this.apiUrl}/orders/${id}`);
    }

    deleteOrder(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/orders/${id}`);
    }

    updateStatus(id: number, status: OrderStatus): Observable<Order> {
        return this.http.patch<Order>(`${this.apiUrl}/orders/${id}/status`, {}, {
            params: new HttpParams().set('status', status)
        });
    }

    getProducts(): Observable<Product[]> {
        return this.http.get<Product[]>(`${this.apiUrl}/products`);
    }
}

export enum OrderStatus {
    OPEN = 'OPEN',
    CONFIRMED = 'CONFIRMED',
    SHIPPED = 'SHIPPED',
    DELIVERED = 'DELIVERED',
    CANCELED = 'CANCELED'
}

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
}

export interface OrderItem {
    productId: number;
    productName: string;
    quantity: number;
    unitPrice: number;
    subTotal: number;
}

export interface Order {
    id: number;
    userEmail: string;
    createdAt: string;
    status: OrderStatus;
    total: number;
    items: OrderItem[];
}

export interface User {
    email: string;
    roles: string[];
    token: string;
}

export interface LoginResponse {
    accessToken: string;
    tokenType: string;
    email: string;
    roles: string[];
}

export interface OrderItemRequest {
    productId: number;
    quantity: number;
}

export interface Page<T> {
    content: T[];
    pageable: any;
    last: boolean;
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    sort: any;
    first: boolean;
    numberOfElements: number;
    empty: boolean;
}

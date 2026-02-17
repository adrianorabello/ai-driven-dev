import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LoginResponse, User } from '../../shared/models/models';

import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = `${environment.apiUrl}/auth`;
    private currentUserSubject = new BehaviorSubject<User | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor(private http: HttpClient) {
        this.loadUserFromStorage();
    }

    login(credentials: any): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
            tap(response => {
                const user: User = {
                    email: response.email,
                    roles: response.roles,
                    token: response.accessToken
                };
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.currentUserSubject.next(user);
            })
        );
    }

    logout() {
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }

    getToken(): string | null {
        const user = this.currentUserSubject.value;
        return user ? user.token : null;
    }

    getUser(): User | null {
        return this.currentUserSubject.value;
    }

    private loadUserFromStorage() {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            try {
                this.currentUserSubject.next(JSON.parse(storedUser));
            } catch (e) {
                console.error('Error parsing user from storage', e);
                localStorage.removeItem('currentUser');
            }
        }
    }

    hasRole(role: string): boolean {
        const user = this.currentUserSubject.value;
        if (!user) return false;
        return user.roles.includes(role);
    }
}

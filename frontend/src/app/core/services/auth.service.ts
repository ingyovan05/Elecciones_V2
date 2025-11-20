
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, map, tap } from 'rxjs';

export interface UserSession {
  id: string;
  username: string;
  role: 'ADMIN' | 'NORMAL' | 'ANON';
}

interface LoginResponse {
  accessToken: string;
  user: UserSession;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'elecciones_token';
  private currentUserSubject = new BehaviorSubject<UserSession | null>(null);

  constructor(private http: HttpClient, private router: Router) {
    const token = this.token;
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.currentUserSubject.next({
          id: payload.sub,
          username: payload.username,
          role: payload.role,
        });
      } catch {
        this.logout();
      }
    }
  }

  login(credentials: { username: string; password: string }) {
    return this.http.post<LoginResponse>('/api/auth/login', credentials).pipe(
      tap((res) => {
        localStorage.setItem(this.tokenKey, res.accessToken);
        this.currentUserSubject.next(res.user);
      }),
      map(() => void 0),
    );
  }

  logout(reason?: string) {
    localStorage.removeItem(this.tokenKey);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login'], { queryParams: reason ? { message: reason } : undefined });
  }

  get token() {
    return localStorage.getItem(this.tokenKey);
  }

  get currentUser$() {
    return this.currentUserSubject.asObservable();
  }

  get isAdmin$() {
    return this.currentUser$.pipe(map((user) => user?.role === 'ADMIN'));
  }
}

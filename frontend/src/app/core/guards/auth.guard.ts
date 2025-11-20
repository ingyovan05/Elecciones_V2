
import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuardService {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (!this.auth.token) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}

export const authGuard: CanActivateFn = () => {
  return inject(AuthGuardService).canActivate();
};

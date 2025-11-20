
import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { AnonymousRegistrationComponent } from './anonymous-registration/anonymous-registration.component';
import { DashboardComponent } from './normal-dashboard/dashboard.component';
import { AdminDashboardComponent } from './admin/admin-dashboard.component';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'registro-anonimo', component: AnonymousRegistrationComponent },
  { path: 'panel', canActivate: [authGuard], component: DashboardComponent },
  { path: 'admin', canActivate: [authGuard, adminGuard], component: AdminDashboardComponent },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: '**', redirectTo: 'login' },
];

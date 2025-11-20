import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });
  message?: string;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snack: MatSnackBar,
  ) {}

  ngOnInit() {
    this.message = this.route.snapshot.queryParamMap.get('message') ?? undefined;
  }

  submit() {
    if (this.form.invalid) {
      return;
    }
    this.auth.login(this.form.getRawValue()).subscribe({
      next: () => {
        this.snack.open('Bienvenido', 'Cerrar', { duration: 2500 });
        this.router.navigate(['/panel']);
      },
      error: (error) => {
        this.snack.open(error.error?.message ?? 'Error al iniciar sesión', 'Cerrar');
      },
    });
  }

  goAnonymous() {
    this.router.navigate(['/registro-anonimo']);
  }
}

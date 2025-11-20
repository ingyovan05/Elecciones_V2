import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-users-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatChipsModule,
    MatSnackBarModule,
  ],
  templateUrl: './users-management.component.html',
  styleUrls: ['./users-management.component.scss'],
})
export class UsersManagementComponent implements OnInit {
  displayedColumns = ['username', 'role', 'isBlocked', 'isActive', 'actions'];
  data: any[] = [];
  roleOptions = [
    { label: 'Administrador', value: 'ADMIN' },
    { label: 'Normal', value: 'NORMAL' },
  ];

  form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    role: ['NORMAL', Validators.required],
  });

  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    private snack: MatSnackBar,
  ) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.api.get<any[]>('/api/users').subscribe((users) => (this.data = users));
  }

  create() {
    if (this.form.invalid) return;
    this.api.post('/api/users', this.form.getRawValue()).subscribe({
      next: () => {
        this.snack.open('Usuario creado', 'Cerrar', { duration: 2500 });
        this.form.reset({ role: 'NORMAL' });
        this.load();
      },
      error: (error) =>
        this.snack.open(error.error?.message ?? 'No se pudo crear', 'Cerrar', { duration: 3000 }),
    });
  }

  toggleActive(user: any) {
    this.api.patch(`/api/users/${user.id}`, { isActive: !user.isActive }).subscribe(() => {
      this.snack.open('Estado actualizado', 'Cerrar', { duration: 2000 });
      this.load();
    });
  }

  unlock(user: any) {
    this.api.patch(`/api/users/${user.id}`, { isBlocked: false, failedAttempts: 0 }).subscribe(() => {
      this.snack.open('Usuario desbloqueado', 'Cerrar', { duration: 2000 });
      this.load();
    });
  }
}

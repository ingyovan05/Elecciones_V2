import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-departments-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatChipsModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  templateUrl: './departments-management.component.html',
  styleUrls: ['./departments-management.component.scss'],
})
export class DepartmentsManagementComponent implements OnInit {
  form = this.fb.nonNullable.group({
    daneCode: ['', Validators.required],
    name: ['', Validators.required],
  });

  displayedColumns = ['daneCode', 'name', 'createdBy', 'updatedBy', 'isActive', 'actions'];
  data: any[] = [];
  editingId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private snack: MatSnackBar,
  ) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.api.get<any[]>('/api/departments').subscribe((list) => (this.data = list));
  }

  save() {
    if (this.form.invalid) return;
    const payload = this.form.getRawValue();
    const isEditing = !!this.editingId;
    const request$ = isEditing
      ? this.api.patch(`/api/departments/${this.editingId}`, payload)
      : this.api.post('/api/departments', payload);

    request$.subscribe({
      next: () => {
        this.snack.open(
          isEditing ? 'Departamento actualizado' : 'Departamento guardado',
          'Cerrar',
          { duration: 2500 },
        );
        this.form.reset();
        this.editingId = null;
        this.load();
      },
      error: (error) =>
        this.snack.open(error.error?.message ?? 'No se pudo guardar', 'Cerrar', { duration: 3000 }),
    });
  }

  startEdit(item: any) {
    this.editingId = item.id;
    this.form.patchValue({
      daneCode: item.daneCode,
      name: item.name,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit() {
    this.editingId = null;
    this.form.reset();
  }

  deactivate(item: any) {
    this.api.delete(`/api/departments/${item.id}`).subscribe(() => {
      this.snack.open('Departamento desactivado', 'Cerrar', { duration: 2000 });
      this.load();
    });
  }
}

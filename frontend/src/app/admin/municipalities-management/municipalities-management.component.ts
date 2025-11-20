import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '../../core/services/api.service';
import { CatalogService } from '../../core/services/catalog.service';

@Component({
  selector: 'app-municipalities-management',
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
    MatChipsModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  templateUrl: './municipalities-management.component.html',
  styleUrls: ['./municipalities-management.component.scss'],
})
export class MunicipalitiesManagementComponent implements OnInit {
  form = this.fb.nonNullable.group({
    daneCode: ['', Validators.required],
    name: ['', Validators.required],
    departmentId: ['', Validators.required],
  });

  displayedColumns = [
    'daneCode',
    'name',
    'department',
    'createdBy',
    'updatedBy',
    'isActive',
    'actions',
  ];
  data: any[] = [];
  editingId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    public catalog: CatalogService,
    private snack: MatSnackBar,
  ) {}

  ngOnInit() {
    this.catalog.loadInitial();
    this.load();
  }

  load() {
    this.api.get<any[]>('/api/municipalities').subscribe((list) => (this.data = list));
  }

  save() {
    if (this.form.invalid) return;
    const payload = this.form.getRawValue();
    const isEditing = !!this.editingId;
    const request$ = isEditing
      ? this.api.patch(`/api/municipalities/${this.editingId}`, payload)
      : this.api.post('/api/municipalities', payload);

    request$.subscribe({
      next: () => {
        this.snack.open(isEditing ? 'Municipio actualizado' : 'Municipio guardado', 'Cerrar', {
          duration: 2500,
        });
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
      departmentId: item.department?.id ?? '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit() {
    this.editingId = null;
    this.form.reset();
  }

  deactivate(item: any) {
    this.api.delete(`/api/municipalities/${item.id}`).subscribe(() => {
      this.snack.open('Municipio desactivado', 'Cerrar', { duration: 2000 });
      this.load();
    });
  }
}

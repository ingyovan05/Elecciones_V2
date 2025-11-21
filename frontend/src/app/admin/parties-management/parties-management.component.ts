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
  selector: 'app-parties-management',
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
  templateUrl: './parties-management.component.html',
  styleUrls: ['./parties-management.component.scss'],
})
export class PartiesManagementComponent implements OnInit {
  private readonly namePattern = /^[A-Za-z\u00C0-\u017F\s'-]{3,80}$/;
  private readonly codePattern = /^[A-Za-z0-9]{2,10}$/;

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.pattern(this.namePattern)]],
    code: ['', Validators.pattern(this.codePattern)],
  });

  displayedColumns = ['name', 'code', 'createdBy', 'updatedBy', 'isActive', 'actions'];
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
    this.api.get<any[]>('/api/parties').subscribe((list) => (this.data = list));
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload = this.form.getRawValue();
    const isEditing = !!this.editingId;
    const request$ = isEditing
      ? this.api.patch(`/api/parties/${this.editingId}`, payload)
      : this.api.post('/api/parties', payload);

    request$.subscribe({
      next: () => {
        this.snack.open(isEditing ? 'Partido actualizado' : 'Partido guardado', 'Cerrar', { duration: 2500 });
        this.form.reset();
        this.editingId = null;
        this.load();
      },
      error: (error) =>
        this.snack.open(error.error?.message ?? 'No se pudo guardar', 'Cerrar', { duration: 3000 }),
    });
  }

  startEdit(party: any) {
    this.editingId = party.id;
    this.form.patchValue({
      name: party.name,
      code: party.code || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit() {
    this.editingId = null;
    this.form.reset();
  }

  controlInvalid(controlName: string, error?: string) {
    const control = this.form.get(controlName);
    if (!control) return false;
    const interacted = control.dirty || control.touched;
    if (error) {
      return control.hasError(error) && interacted;
    }
    return control.invalid && interacted;
  }

  deactivate(party: any) {
    this.api.delete(`/api/parties/${party.id}`).subscribe(() => {
      this.snack.open('Partido desactivado', 'Cerrar', { duration: 2000 });
      this.load();
    });
  }
}

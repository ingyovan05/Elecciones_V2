import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { switchMap } from 'rxjs';
import { CatalogService, Option } from '../../core/services/catalog.service';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-person-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatSnackBarModule,
  ],
  templateUrl: './person-form.component.html',
  styleUrls: ['./person-form.component.scss'],
})
export class PersonFormComponent implements OnInit {
  private readonly cedulaPattern = /^[0-9]{6,12}$/;
  private readonly namePattern = /^[A-Za-z\u00C0-\u017F\s'-]{2,60}$/;

  @Input() isAnonymous = false;
  @Output() saved = new EventEmitter<any>();
  @Output() cancelled = new EventEmitter<void>();

  @Input()
  set editingPerson(person: any | null) {
    if (person) {
      this.form.patchValue({
        id: person.id,
        cedula: person.cedula,
        firstName: person.firstName,
        middleName: person.middleName,
        lastName: person.lastName,
        secondLastName: person.secondLastName,
        partyId: person.party?.id ?? '',
        departmentId: person.department?.id ?? '',
        municipalityId: person.municipality?.id ?? '',
        votesCongress: !!person.votesCongress,
        votesPresident: !!person.votesPresident,
        acceptsTerms: !!person.acceptsTerms,
      });
    } else {
      this.resetForm();
    }
  }

  municipalities: Option[] = [];
  voteOptions = [
    { label: 'Sí', value: true },
    { label: 'No', value: false },
  ];

  form = this.fb.nonNullable.group({
    id: [''],
    cedula: ['', [Validators.required, Validators.pattern(this.cedulaPattern)]],
    firstName: ['', [Validators.required, Validators.pattern(this.namePattern)]],
    middleName: ['', Validators.pattern(this.namePattern)],
    lastName: ['', [Validators.required, Validators.pattern(this.namePattern)]],
    secondLastName: ['', Validators.pattern(this.namePattern)],
    partyId: ['', Validators.required],
    votesCongress: [false],
    votesPresident: [false],
    acceptsTerms: [false, Validators.requiredTrue],
    departmentId: ['', Validators.required],
    municipalityId: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    public catalog: CatalogService,
    private api: ApiService,
    private snack: MatSnackBar,
  ) {}

  ngOnInit() {
    this.catalog.loadInitial();
    this.form
      .get('departmentId')!
      .valueChanges.pipe(switchMap((id) => this.catalog.getMunicipalities(id)))
      .subscribe((list) => (this.municipalities = list));
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    const endpoint = this.isAnonymous ? '/api/persons/anonymous' : '/api/persons';

    if (value.id && !this.isAnonymous) {
      const { id, ...updatePayload } = value;
      this.api.patch<any>(`/api/persons/${value.id}`, updatePayload).subscribe({
        next: (resp) => {
          this.snack.open('Registro actualizado', 'Cerrar', { duration: 2500 });
          this.saved.emit(resp);
          this.resetForm();
        },
        error: (error) => this.snack.open(error.error?.message ?? 'No se pudo actualizar', 'Cerrar'),
      });
      return;
    }

    const { id, ...payload } = value;
    this.api.post<{ conflict: boolean; person: any }>(endpoint, payload).subscribe({
      next: (resp) => {
        if (resp.conflict) {
          this.snack.open('La persona ya está registrada. Actualiza los datos.', 'Cerrar', {
            duration: 3000,
          });
          this.form.patchValue({
            id: resp.person.id,
            ...resp.person,
            partyId: resp.person.party?.id,
            departmentId: resp.person.department?.id,
            municipalityId: resp.person.municipality?.id,
          });
        } else {
          this.snack.open('Registro guardado', 'Cerrar', { duration: 2500 });
          this.saved.emit(resp.person);
          this.resetForm();
        }
      },
      error: (error) => this.snack.open(error.error?.message ?? 'No se pudo guardar', 'Cerrar'),
    });
  }

  cancelEdit() {
    this.resetForm();
    this.cancelled.emit();
  }

  private resetForm() {
    this.form.reset({
      id: '',
      votesCongress: false,
      votesPresident: false,
      acceptsTerms: false,
    });
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
}

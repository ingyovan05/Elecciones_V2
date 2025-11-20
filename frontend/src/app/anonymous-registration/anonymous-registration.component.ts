
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { CatalogService, Option } from '../core/services/catalog.service';
import { ApiService } from '../core/services/api.service';

@Component({
  selector: 'app-anonymous-registration',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  templateUrl: './anonymous-registration.component.html',
  styleUrls: ['./anonymous-registration.component.scss'],
})
export class AnonymousRegistrationComponent implements OnInit {
  form = this.fb.nonNullable.group({
    cedula: ['', Validators.required],
    firstName: ['', Validators.required],
    middleName: [''],
    lastName: ['', Validators.required],
    secondLastName: [''],
    partyId: ['', Validators.required],
    votesCongress: [false],
    votesPresident: [false],
    acceptsTerms: [false, Validators.requiredTrue],
    departmentId: ['', Validators.required],
    municipalityId: ['', Validators.required],
  });

  municipalities: Option[] = [];

  constructor(
    private fb: FormBuilder,
    public catalog: CatalogService,
    private api: ApiService,
    private router: Router,
    private snack: MatSnackBar,
  ) {}

  ngOnInit() {
    this.catalog.loadInitial();
    this.form
      .get('departmentId')!
      .valueChanges.pipe(
        switchMap((id) => this.catalog.getMunicipalities(id)),
      )
      .subscribe((list) => (this.municipalities = list));
  }

  submit() {
    if (this.form.invalid) return;
    this.api.post('/api/persons/anonymous', this.form.getRawValue()).subscribe({
      next: () => {
        this.snack.open('Registro guardado', 'Cerrar', { duration: 2500 });
        this.form.reset({
          votesCongress: false,
          votesPresident: false,
          acceptsTerms: false,
        });
      },
      error: (error) =>
        this.snack.open(error.error?.message ?? 'No se pudo guardar', 'Cerrar', { duration: 3000 }),
    });
  }

  goBackToLogin() {
    this.router.navigate(['/login']);
  }
}

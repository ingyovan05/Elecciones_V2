import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ApiService } from '../../core/services/api.service';
import { CatalogService } from '../../core/services/catalog.service';

@Component({
  selector: 'app-person-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatTooltipModule,
  ],
  templateUrl: './person-list.component.html',
  styleUrls: ['./person-list.component.scss'],
})
export class PersonListComponent implements OnInit {
  displayedColumns = [
    'cedula',
    'name',
    'party',
    'department',
    'municipality',
    'createdBy',
    'actions',
  ];
  data: any[] = [];
  total = 0;
  pageSize = 10;
  currentPage = 0;
  readonly anonUserId = '00000000-0000-0000-0000-000000000002';
  @Output() editPerson = new EventEmitter<any>();
  @ViewChild(MatPaginator) paginator?: MatPaginator;

  filterForm = this.fb.group({
    cedula: [''],
    name: [''],
  });

  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    public catalog: CatalogService,
    private snack: MatSnackBar,
  ) {}

  ngOnInit() {
    this.catalog.loadInitial();
    this.search();
  }

  search(pageIndex = 0) {
    this.currentPage = pageIndex;
    const params = {
      ...this.filterForm.value,
      page: pageIndex,
      size: this.pageSize,
    };
    this.api.get<any>('/api/persons', { params }).subscribe((result) => {
      this.data = result.items;
      this.total = result.total;
    });
  }

  onPage(event: PageEvent) {
    this.search(event.pageIndex);
  }

  clearFilters() {
    this.filterForm.reset({
      cedula: '',
      name: '',
    });
    this.search(0);
    if (this.paginator) {
      this.paginator.firstPage();
    }
  }

  deactivate(person: any) {
    this.api.delete(`/api/persons/${person.id}`).subscribe({
      next: () => {
        this.snack.open('Registro desactivado', 'Cerrar', { duration: 2500 });
        this.search(this.currentPage);
      },
      error: (error) => this.snack.open(error.error?.message ?? 'No se pudo desactivar', 'Cerrar'),
    });
  }

  startEdit(person: any) {
    this.editPerson.emit(person);
  }
}

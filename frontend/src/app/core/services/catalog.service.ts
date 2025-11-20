
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { ApiService } from './api.service';

export interface Option {
  id: string;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class CatalogService {
  parties$ = new BehaviorSubject<Option[]>([]);
  departments$ = new BehaviorSubject<Option[]>([]);

  constructor(private api: ApiService) {}

  loadInitial() {
    this.api.get<Option[]>('/api/parties').subscribe((list) => this.parties$.next(list));
    this.api
      .get<Option[]>('/api/departments')
      .subscribe((list) => this.departments$.next(list));
  }

  getMunicipalities(departmentId: string) {
    return this.api.get<Option[]>('/api/municipalities', { params: { departmentId } });
  }
}

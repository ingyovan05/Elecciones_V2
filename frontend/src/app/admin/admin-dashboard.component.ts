
import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { UsersManagementComponent } from './users-management/users-management.component';
import { PartiesManagementComponent } from './parties-management/parties-management.component';
import { DepartmentsManagementComponent } from './departments-management/departments-management.component';
import { MunicipalitiesManagementComponent } from './municipalities-management/municipalities-management.component';
import { PersonListComponent } from '../persons/person-list/person-list.component';
import { PersonFormComponent } from '../persons/person-form/person-form.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    UsersManagementComponent,
    PartiesManagementComponent,
    DepartmentsManagementComponent,
    MunicipalitiesManagementComponent,
    PersonListComponent,
    PersonFormComponent,
  ],
  template: `
    <mat-tab-group fitInkBarToContent [(selectedIndex)]="selectedTab">
      <mat-tab>
        <ng-template mat-tab-label>
          <mat-icon>how_to_reg</mat-icon>
          Registro Personas
        </ng-template>
        <div class="tab-pad">
          <app-person-form
            [editingPerson]="selectedPerson"
            (saved)="handleSaved()"
            (cancelled)="handleCancelled()"
          ></app-person-form>
        </div>
      </mat-tab>

      <mat-tab>
        <ng-template mat-tab-label>
          <mat-icon>list_alt</mat-icon>
          Personas
        </ng-template>
        <div class="tab-pad">
          <app-person-list (editPerson)="handleEdit($event)"></app-person-list>
        </div>
      </mat-tab>

      <mat-tab>
        <ng-template mat-tab-label>
          <mat-icon>group</mat-icon>
          Usuarios
        </ng-template>
        <div class="tab-pad">
          <app-users-management></app-users-management>
        </div>
      </mat-tab>

      <mat-tab>
        <ng-template mat-tab-label>
          <mat-icon>flag</mat-icon>
          Partidos
        </ng-template>
        <div class="tab-pad">
          <app-parties-management></app-parties-management>
        </div>
      </mat-tab>

      <mat-tab>
        <ng-template mat-tab-label>
          <mat-icon>map</mat-icon>
          Departamentos
        </ng-template>
        <div class="tab-pad">
          <app-departments-management></app-departments-management>
        </div>
      </mat-tab>

      <mat-tab>
        <ng-template mat-tab-label>
          <mat-icon>location_city</mat-icon>
          Municipios
        </ng-template>
        <div class="tab-pad">
          <app-municipalities-management></app-municipalities-management>
        </div>
      </mat-tab>
    </mat-tab-group>
  `,
  styles: [
    `
      :host {
        display: block;
        padding: 1rem;
      }

      .tab-pad {
        padding: 1rem 0.5rem;
      }
    `,
  ],
})
export class AdminDashboardComponent {
  selectedPerson: any | null = null;
  selectedTab = 0;
  @ViewChild(PersonListComponent) personList?: PersonListComponent;

  handleSaved() {
    this.selectedPerson = null;
    this.personList?.search(this.personList.currentPage);
  }

  handleEdit(person: any) {
    this.selectedPerson = person;
    this.selectedTab = 0;
  }

  handleCancelled() {
    this.selectedPerson = null;
  }
}

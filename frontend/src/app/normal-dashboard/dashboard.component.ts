
import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { PersonFormComponent } from '../persons/person-form/person-form.component';
import { PersonListComponent } from '../persons/person-list/person-list.component';

@Component({
  selector: 'app-normal-dashboard',
  standalone: true,
  imports: [CommonModule, MatTabsModule, MatIconModule, PersonFormComponent, PersonListComponent],
  template: `
    <mat-tab-group animationDuration="300ms" [(selectedIndex)]="selectedTab">
      <mat-tab>
        <ng-template mat-tab-label>
          <mat-icon>how_to_reg</mat-icon>
          Registrar persona
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
          Listado
        </ng-template>
        <div class="tab-pad">
          <app-person-list (editPerson)="handleEdit($event)"></app-person-list>
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
export class DashboardComponent {
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

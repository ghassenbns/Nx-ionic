import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslocoTestingModule } from '@ngneat/transloco';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';

import { SharedModule } from '../../../shared.module';
import { DataTableComponent } from '../data-table.component';
import { TableFiltersModalComponent } from './table-filters-modal.component';

describe('TableFiltersModalComponent', () => {
  let filterFixture: ComponentFixture<TableFiltersModalComponent>;
  let filterComponent: TableFiltersModalComponent;
  let component: DataTableComponent<unknown>;
  let fixture: ComponentFixture<DataTableComponent<unknown>>;

  beforeEach(async () => {
    const toastrService = {
      create: jest.fn(() => Promise.resolve({ present: jest.fn() })),
    };

    await TestBed.configureTestingModule({
      declarations: [DataTableComponent, TableFiltersModalComponent],
      imports: [
        TranslocoTestingModule.forRoot({
          langs: { en : {}, es : {} },
          translocoConfig: {
            availableLangs: ['en', 'es'],
            defaultLang: 'en',
          },
       }),
        SharedModule,
        RouterTestingModule,
        EffectsModule.forRoot([]),
        StoreModule.forRoot([]),
      ],
      providers: [
        { provide: ToastrService, useValue: toastrService },
      ],
      schemas: [NO_ERRORS_SCHEMA],

    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataTableComponent);
    component = fixture.componentInstance;
    component.strategy = {
      name: 'fleets',
      entity: 'fleet',
      columns: [
        {
          field: 'name',
          contentType: 'string',
          filterType: 'string',
          rowSelector: 'name',
          searchType: 'text',
          options: [],
          link: {
            field: 'id',
            pref: '',
            sfx: '',
          },
        },
      ],
      actions: [
      ],
      multiActions: [
      ],
    };
    component.tableData = {
      data: [
        {
          _id: 1,
          name: 'John',
          description: 30,
          owner_details: {
            name: 'ADMIN',
          },
          is_active: false,
        },
        {
          _id: 2,
          name: 'John2',
          description: 32,
          owner_details: {
            name: 'ADMIN2',
          },
          is_active: true,
        },
      ],
      status: 'ok',
      pagination: {
        to: 10,
        from: 1,
        total: 30,
        currentPage: 1,
        lastPage: 3,
        perPage: 10,
      },
    };

    fixture.detectChanges();
  });

  beforeEach(() => {
    filterFixture = TestBed.createComponent(TableFiltersModalComponent);
    filterComponent = filterFixture.componentInstance;
    filterComponent.table = component.table;
    filterFixture.detectChanges();
  });

  it('should create the component', () => {
    expect(filterComponent).toBeTruthy();
  });
});

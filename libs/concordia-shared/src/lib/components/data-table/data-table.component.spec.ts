import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ModalController } from '@ionic/angular';
import { TranslocoTestingModule } from '@ngneat/transloco';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { PrimeNGConfig } from 'primeng/api';

import { SharedModule } from '../../shared.module';
import { DataTableComponent } from './data-table.component';
import { TableFiltersModalComponent } from './table-filters-modal/table-filters-modal.component';

xdescribe('DataTableComponent', () => {
  let component: DataTableComponent<any>;
  // todo fix type
  let fixture: ComponentFixture<DataTableComponent<any>>;
  // todo fix type

  let modalController: ModalController;

  beforeEach(async () => {
    const modalControllerMock = {
      create: jest.fn(() => Promise.resolve({ present: jest.fn() })),
    };

    const toastrService = {
      create: jest.fn(() => Promise.resolve({ present: jest.fn() })),
    };

    await TestBed.configureTestingModule({
      declarations: [DataTableComponent, TableFiltersModalComponent],
      providers: [
        PrimeNGConfig,
        { provide: ModalController, useValue: modalControllerMock },
        { provide: ToastrService, useValue: toastrService },
      ],
      imports: [
        SharedModule,
        RouterTestingModule,
        EffectsModule.forRoot([]),
        StoreModule.forRoot([]),
        TranslocoTestingModule.forRoot({
          langs: { en : {}, es : {} },
          translocoConfig: {
            availableLangs: ['en', 'es'],
            defaultLang: 'en',
          },
       }),

      ],
    }).compileComponents();

    modalController = TestBed.inject(ModalController);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataTableComponent);
    component = fixture.componentInstance;
    jest.spyOn(console, 'error').mockImplementation();

    component.strategy = {
      name: 'name',
      entity: 'name',
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
      multiActions: [],
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the data array', () => {
    expect(component.data.length).toEqual(2);
  });

  it('should open the filters modal', async () => {
    await component.openFiltersModal();

    expect(modalController.create).toHaveBeenCalledWith({
      initialBreakpoint: 0.5,
      breakpoints: [0, 0.25, 0.5, 1],
      showBackdrop: true,
      backdropDismiss: true,
      component: TableFiltersModalComponent,
      componentProps: {
        table: component.table,
        columns: component.strategy.columns,
      },
    });
  });

  it('should clear the table filters', () => {
    component.table.hasFilter = jest.fn(() => true);
    component.table.sortField = 'name';
    component.table.reset = jest.fn();

    component.clearFilters();

    expect(component.table.filters).toEqual({});
    expect(component.table._sortField).toBe('null');
    expect(component.table.reset).toHaveBeenCalled();
  });

  // it('should apply a text filter to the table', () => {
  //   component.table.reset = jest.fn();
  //   const event = { detail: { value: '' } };
  //   const field = 'name';
  //   const type = 'string';
  //
  //   component.onTextFilter(event, field, type);
  //
  //   expect(component.table.reset).toHaveBeenCalled();
  // });
});

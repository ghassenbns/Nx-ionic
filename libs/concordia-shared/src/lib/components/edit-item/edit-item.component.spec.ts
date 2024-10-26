import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { fakeAsync, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserStateService } from '@concordia-nx-ionic/concordia-core';
import { UINotificationStateService } from '@concordia-nx-ionic/concordia-ui';
import { TestElementFinder } from '@concordia-nx-ionic/concordia-util';
import { IonicModule, ModalController, PopoverController } from '@ionic/angular';
import { createHostFactory, SpectatorHost } from '@ngneat/spectator/jest';
import { TranslocoTestingModule } from '@ngneat/transloco';
import { of } from 'rxjs';

import { SwitchMultiCasePipePipe, UserDatePipe } from '../../pipes';
import { DatePickerComponent } from '../date-picker/date-picker.component';
import { SelectSearchComponent } from '../index';
import { EditItemComponent as SuT } from './edit-item.component';

const createHost = createHostFactory({
  component: SuT,
  detectChanges: false,
  declarations: [
    DatePickerComponent,
    SelectSearchComponent,
    UserDatePipe,
    SwitchMultiCasePipePipe,
  ],
  imports: [
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    TranslocoTestingModule.forRoot({
      langs: { en: {
          table: {
            createNew: 'Create new',
            edit: 'Edit',
            clone: 'Clone',
          },
          entities: {
            table: 'table',
          },
        }, es: {} },
      translocoConfig: {
        availableLangs: ['en', 'es'],
        defaultLang: 'en',
      },
    }),
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
  ],
  mocks: [
    PopoverController,
    UINotificationStateService,
  ],
  providers: [
    ModalController,
    {
      provide: UserStateService,
      useValue: {
        getDateTimeFormat$: jest.fn().mockReturnValue(of('YYYY-MM-DD HH:mm:ss')),
        getTZ$: jest.fn().mockReturnValue(of('UTC')),
        getLocale$: jest.fn().mockReturnValue(of('en')),
      },
    },
  ],
});

describe('EditItemComponent', () => {
  const modelEdit = {
    _id: '12345',
    string: 'String',
    stringRequired: 'String Required',
    select: '2',
    selectSearch: '1',
    date: 1698769620000,
  };

  let spectator: SpectatorHost<SuT>;
  beforeEach(() => {
    spectator = createHost(`<concordia-ng-shared-edit-item [strategy]="strategy"
                               [model]="model"
                               [loading]="loading">
                            </concordia-ng-shared-edit-item>`, {
      hostProps: {
        strategy: {
          name: 'tables',
          entity: 'table',
          columns: [
            {
              field: 'string',
              contentType: 'string',
              filterType: 'string',
              rowSelector: 'string',
              required: true,
              searchType: 'text',
              options: [],
            },
            {
              field: 'stringRequired',
              contentType: 'string',
              filterType: 'string',
              rowSelector: 'stringRequired',
              required: true,
              searchType: 'text',
              options: [],
            },
            {
              field: 'select',
              contentType: 'string',
              filterType: 'boolean',
              rowSelector: 'select',
              searchType: 'select',
              required: true,
              defaultValue: '1',
              options: [
                { name: 'name1', _id: '1' },
                { name: 'name2', _id: '2' },
              ],
            },
            {
              field: 'selectSearch',
              contentType: 'string',
              rowSelector: 'selectSearch',
              required: true,
              searchType: 'multiSelectSearch',
              searchSelector: 'selectSearch',
              editType: 'selectSearch',
              filterType: 'object-id',
              options: [
                { name: 'name1', _id: '1' },
                { name: 'name2', _id: '2' },
              ],
            },
            {
              field: 'date',
              contentType: 'date',
              rowSelector: 'date',
              required: true,
              searchType: 'date',
              editType: 'date',
              filterType: 'string',
              filterRange: true,
              options: [],
            },
          ],
          actions: [],
          multiActions: [],
        },
        model: null,
        loading: false,
      },
    });
  });

  const elements = TestElementFinder.configureSpectatorFinder([
    'title',
    'cancelBtn',
    'saveBtn',
    ['item', 'multiple'],
    ['input', 'multiple'],
    ['select', 'multiple'],
    ['selectSearch', 'multiple'],
    ['date', 'multiple'],
  ]);

  it('should create', () => {
    spectator.detectChanges();
    expect(spectator.component).toBeTruthy();
  });

  it('should be new title', fakeAsync(() => {
    tick(500);
    spectator.detectChanges();

    const els = elements(spectator);
    expect(els.title).toContainText('Create new table');
  }));

  it('should be edit title', fakeAsync(() => {
    spectator.detectChanges();
    spectator.setInput('model', modelEdit);

    tick();

    const els = elements(spectator);
    expect(els.title).toContainText('Edit table');
  }));

  it('should be clone title', fakeAsync(() => {
    spectator.detectChanges();
    spectator.setInput('model', modelEdit);
    spectator.setInput('clone', true);

    tick();

    const els = elements(spectator);
    expect(els.title).toContainText('Clone table');
  }));

  it('should be new form', fakeAsync( () => {
    spectator.detectChanges();
    tick();

    const ctrlName = spectator.component.form.value.name;

    expect(ctrlName).toBeUndefined();

    const ctrlString = spectator.component.form.value.string;

    expect(ctrlString).toBeUndefined();

    const ctrlStringR = spectator.component.form.value.stringRequired;

    expect(ctrlStringR).toBeUndefined();

    const ctrlSelect = spectator.component.form.value.select;

    expect(ctrlSelect).toBe('1');

    const ctrlSelectSearch = spectator.component.form.value.selectSearch;

    expect(ctrlSelectSearch).toBeUndefined();

    const ctrlDate = spectator.component.form.value.date;

    expect(ctrlDate).toBeUndefined();

    const els = elements(spectator);

    expect(els.item.length).toBe(5);
    expect(els.input.length).toBe(2);
    expect(els.select.length).toBe(1);
    expect(els.selectSearch.length).toBe(1);
    expect(els.date.length).toBe(1);

  }));

  it('should be edit form', fakeAsync( () => {
    spectator.detectChanges();
    spectator.setInput('model', modelEdit);
    tick();

    const ctrlString = spectator.component.form.value.string;

    expect(ctrlString).toBe('String');

    const ctrlStringR = spectator.component.form.value.stringRequired;

    expect(ctrlStringR).toBe('String Required');

    const ctrlSelect = spectator.component.form.value.select;

    expect(ctrlSelect).toBe('2');

    const ctrlSelectSearch = spectator.component.form.value.selectSearch;

    expect(ctrlSelectSearch).toBe('1');

    const ctrlDate = spectator.component.form.value.date;

    expect(ctrlDate).toBe(1698769620000);

  }));

});

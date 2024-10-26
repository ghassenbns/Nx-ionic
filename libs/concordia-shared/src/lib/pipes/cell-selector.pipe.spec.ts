import { TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { Column } from '../interfaces';
import { CellSelectorPipe } from './cell-selector.pipe';

describe('CellSelectorPipe', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IonicModule],
    }).compileComponents();
  });
  const pipe = new CellSelectorPipe();

  it('should transform the row data based on the given column selector', () => {
    const row = { id: 1, name: 'ABC', email: 'test@example.com' };
    const column: Column = {
      field: 'name',
      rowSelector: 'name',
      searchType: 'text',
      options: [],
      contentType: 'boolean',
      filterType: 'boolean',
    };

    expect(pipe.transform(row, column)).toBe('ABC');
  });

  it('should handle nested selectors', () => {
    const row = {
      id: 1,
      name: 'ABC',
      address: {
        street: 'testing street',
        city: 'Anytown',
      },
    };
    const column: Column = {
      field: 'name',
      rowSelector: 'address.city',
      searchType: 'text',
      options: [],
      contentType: 'boolean',
      filterType: 'boolean',
    };

    expect(pipe.transform(row, column)).toBe('Anytown');
  });
});

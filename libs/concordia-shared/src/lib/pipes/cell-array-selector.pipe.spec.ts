import { Column } from '../interfaces/table-data/column';
import { CellArraySelectorPipe } from './cell-array-selector.pipe';

describe('ArrayJoinPipe', () => {
  it('create an instance', () => {
    const pipe = new CellArraySelectorPipe();
    expect(pipe).toBeTruthy();
  });

  it('should join array elements using the character passed as param', () => {
    const row = { id: 1, arrayField: [1, 2, 3], email: 'test@example.com' };
    const column: Column = {
      field: 'arrayField',
      rowSelector: 'arrayField',
      searchType: 'text',
      options: [],
      contentType: 'array',
      filterType: 'string',
    };
    const pipe = new CellArraySelectorPipe();
    const separator = '-';

    expect(pipe.transform(row, column, separator)).toBe('1-2-3');
  });

  it('should handle arrays with one element', () => {
    const row = { id: 1, arrayField: [1], email: 'test@example.com' };
    const column: Column = {
      field: 'arrayField',
      rowSelector: 'arrayField',
      searchType: 'text',
      options: [],
      contentType: 'array',
      filterType: 'string',
    };
    const pipe = new CellArraySelectorPipe();
    const separator = '-';

    expect(pipe.transform(row, column, separator)).toBe('1');
  });
});

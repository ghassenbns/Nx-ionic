import { Pipe, PipeTransform } from '@angular/core';

import { Column } from '../interfaces';

@Pipe({
  name: 'cellSelector',
})
export class CellSelectorPipe implements PipeTransform {
  transform(row: any, column: Column): string {
    const selectors = column.rowSelector.split('.');
    let value = row;
    selectors.forEach(selector => {
      value = value && (value[selector] ? value[selector] : (value[selector] === false ? false : null));
    });
    return value;
  }
}

import { Pipe, PipeTransform } from '@angular/core';

import { Column } from '../interfaces';

@Pipe({
  name: 'cellArraySelector',
})
export class CellArraySelectorPipe implements PipeTransform {

  transform(row: any, column: Column, separator = '-'): string | any[] {
    const selectors = column.rowSelector.split('.');
    let value = row;
    selectors.forEach(selector => {
      value = value && value[selector] ? value[selector] : null;
    });
    return value.join(separator);
  }
}

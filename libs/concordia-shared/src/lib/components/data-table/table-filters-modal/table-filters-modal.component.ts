import { Component, Input } from '@angular/core';
import { SelectCustomEvent } from '@ionic/angular';
import { Table } from 'primeng/table';

import { Column } from '../../../interfaces';

@Component({
  selector: 'concordia-ng-shared-table-filters-modal',
  templateUrl: './table-filters-modal.component.html',
  styleUrls: ['./table-filters-modal.component.scss'],
})
export class TableFiltersModalComponent {
  @Input() table!: Table;
  @Input() columns!: Readonly<Column[]>;
  @Input() lazy!: boolean;
  @Input() showedColumns: string[] = [];

  onSelect(event: Event, field: string): void {
    const selectEvent = event as SelectCustomEvent;
    if('value' in selectEvent.target) {
      this.onSetFilter(selectEvent.target.value, field);

      this.initEvent();
    }
  }

  onSelectFilter(event: Event, field: string): void {
    this.onSetFilter(event, field);

    this.initEvent();
  }

  onTextFilter(event: Event, field: string): void {
    if(event instanceof CustomEvent) {
      this.onSetFilter(event.detail.value, field);

      if(!event.detail.value) {
        this.initEvent();
      }
    }
  }

  onSetFilter(value: any, field: string): void {
    const column = this.columns
      .find(c => c.field === field || c.rowSelector === field || c.searchSelector === field);

    this.setFilter(
      column?.filterType === 'object-id' ? [value] : value,
      column?.searchSelector || column?.rowSelector || field,
      column?.searchType === 'text' ?
        'like'
        : column?.searchType === 'date' ? '>='
          : (column?.filterType === 'object-id'
            || column?.filterType === 'id'
            || column?.filterType === 'array') ? 'in' : '=',
      column?.searchType === 'date' ? 'ts' : column?.filterType || 'string');
  }

  onChangeTextFilter(event: any, field: string): void {
    if(!this.lazy) {
      this.table.filter(event.target.value, field, 'contains');

      return;
    }
  }

  isFieldFiltered(field: string): boolean {
    return !this.table.isFilterBlank(field);
  }

  onApplyFilter(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.initEvent();
    }
  }

  getFieldFilterValue(field: string): string {
    if (!this.table?.filters || !(field in this.table.filters)) { return ''; }

    const activeFilter = this.table.filters[field];
    if (Array.isArray(activeFilter)) {
      // If activeFilter is an array, assume the first item contains the filter value
      const filterMetadata = activeFilter[0];
      return filterMetadata?.value ?? '';
    } else {
      // If activeFilter is not an array, assume it is a single FilterMetadata object
      return activeFilter?.value ?? '';
    }
  }

  /**
   *  -1 : DESC Order
   *  1 : ASC ORDER
   *
   * @param {string} field
   * @return {*}  {number}
   * @memberof TableFiltersModalComponent
   */
  getNextSortOrder(field: string): number {
    if (field !== this.table.sortField) { return -1; }
    switch (this.table.sortOrder) {
      case 1:
        return -1;
      case -1:
        return 1;
      default:
        return -1;
    }
  }

  onSort(field: string): void {
    const nextSortOrder = this.getNextSortOrder(field);
    this.table.sortField = field;
    this.table.sortOrder = nextSortOrder;
    return this.table.sortSingle();
  }

  showColumn(field: any): boolean {
    return this.showedColumns.includes(field);
  }

  filteredOptions(options: any[], optionsFilter: string[] = [], row: any): any[] {
    return optionsFilter.length
      ? options.filter(o => optionsFilter.every(key => o[key] === row[key])) : options;
  }

  /**
   * setFilter
   * @type { value: any, field: string, matchMode: string, type: string}
   */
  private setFilter(value: any, field: string, matchMode: string, type: string): void {
    this.table.filters = {
      ...this.table.filters,
      [field]: {
        value: value,
        type: type,
        ...this.lazy && {
          matchMode: matchMode,
        },
      },
    } as any;
  }

  private initEvent(): void {
    if(this.table.sortField) {
      this.table.sortSingle();
    } else {
      this.table.reset();
    }
  }
}

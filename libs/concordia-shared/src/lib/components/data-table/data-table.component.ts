import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { IonPopover, ModalController } from '@ionic/angular';
import { TranslocoService } from '@ngneat/transloco';
import { PrimeNGConfig } from 'primeng/api';
import { Table } from 'primeng/table';

import { ActionEnum, ButtonEnum, ModeEnum, MultiActionEnum } from '../../enum';
import { EditActionEnum } from '../../enum/edit-action-enum';
import { ActionEvent, EditActionEvent, MultiActionEvent } from '../../interfaces';
import { Strategy } from '../../interfaces/table-data/strategy';
import {
  TableEventInterface,
  TableInputDataInterface,
  TableSortInterface,
} from '../../models/table-data';
import { sortFn } from '../../utils/sort';
import { TableFiltersModalComponent } from './table-filters-modal/table-filters-modal.component';

@Component({
  selector: 'concordia-ng-shared-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
})
export class DataTableComponent<T> implements OnInit, OnDestroy, AfterViewInit {
  readonly FIRST = '#';
  readonly ACTIONS = 'actions';
  readonly ModeEnum = ModeEnum;
  readonly ButtonEnum = ButtonEnum;

  @ViewChild('dt') table!: Table;
  @ViewChild('multiActionsPopover') multiActionsPopover!: IonPopover;
  @ViewChild('shoColumnPopover') shoColumnPopover!: IonPopover;
  @ViewChild(NgForm) form!: NgForm;

  _tableData!: TableInputDataInterface<T> | null;
  @Input() set tableData(v: TableInputDataInterface<T> | null) {
    this._tableData = v;
    if (this._tableData) {
      this.data = this._tableData.data;

      if (this._tableData.pagination) {
        this.totalRecords = this._tableData.pagination.total;
        this.first = (this._tableData.pagination.currentPage - 1) * this._tableData.pagination.perPage;
        this.rows = this._tableData.pagination.perPage;
      }

      this.selectedData = [];

      if (!this.rowsPerPageOptions.includes(this.rows)) {
        this.rowsPerPageOptions.push(this.rows);
        this.rowsPerPageOptions = this.rowsPerPageOptions.sort((a, b) => a - b);
      }
    }
  }

  get tableData(): TableInputDataInterface<T> | null {
    return this._tableData;
  }

  _sort!: TableSortInterface[];
  @Input() set sort(v: TableSortInterface[]) {
    if (v?.length) {
      v.forEach((s: TableSortInterface) => {
        this.sortField = s.scope;
        this.sortOrder = sortFn(s.value);
      });
    } else {
      this.sortField = 'null';
      this.sortOrder = 1;
    }
  }

  @Input() set records(v: any) {
    this.data = v;
    this.selectedData = [];
    this.cdr.detectChanges();
  }

  @Input() filters: any;
  @Input() dataKey = '_id';
  @Input() loading = false;
  @Input() actionsLoading = false;
  @Input() strategy!: Strategy;
  @Input() hiddenColumns: string[] = [];
  @Input() actions: string[] = [];
  @Input() editMode = false;
  @Input() canEdit: boolean | null = true;
  @Input() canDelete: boolean | null = true;
  @Input() lazy = true;
  @Input() smallView = false;
  @Input() enableBulkAdd = false;

  @Output() loadEvent = new EventEmitter<TableEventInterface>();
  @Output() actionEvent = new EventEmitter<ActionEvent>();
  @Output() multiActionEvent = new EventEmitter<MultiActionEvent>();
  @Output() editActionEvent = new EventEmitter<EditActionEvent>();
  @Output() changeValueEvent = new EventEmitter<any>();

  tableType!: string;
  data!: any[];
  first = 0;
  rows = 10;
  rowsPerPageOptions: number[] = [10, 25, 50];
  totalRecords = 10;
  sortField = '';
  sortOrder = 1;
  isOpen = false;
  isOpenVisibility = false;
  showedColumns: string[] = [];
  selectedData: any[] = [];
  ActionEnum = ActionEnum;
  MultiActionEnum = MultiActionEnum;
  showFilters = false;

  constructor(
    private readonly primengConfig: PrimeNGConfig,
    private readonly modalController: ModalController,
    private readonly cdr: ChangeDetectorRef,
    private readonly router: Router,
    public translocoService: TranslocoService,
  ) {
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.getItem();
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();

    if (this.filters && Object.keys(this.filters).length) {
      this.showFilters = true;
    }
  }

  ngOnDestroy(): void {
    localStorage.setItem(this.tableType, JSON.stringify(this.showedColumns));
  }

  load(event: any): void {
    this.loadEvent.emit(event);
  }

  getItem(): void {
    const columns = this.strategy.columns.map(i => i.field);
    const fixed = this.strategy.columns.filter(i => i.fixed).map(i => i.field);
    columns.push(this.FIRST);
    columns.push(this.ACTIONS);

    const urlArr = this.router.url.split('?')[0].split('/').filter(i => !!i);

    this.tableType = urlArr.length === 1 && urlArr[0] === this.strategy.name
      ? this.strategy.name
      : `${urlArr[0]}-${this.strategy.name}`;

    const localStorageItem = localStorage.getItem(this.tableType);
    this.showedColumns = (localStorageItem
      ? [...new Set([...JSON.parse(localStorageItem), ...new Set(fixed)])]
      : columns)
      .filter(column => this.canShow(column));
  }

  canShow(field: string): boolean {
    return !this.hiddenColumns.some(hiddenColumn => field === hiddenColumn)
      && !this.strategy.columns.find(column => column.field === field)?.hidden?.includes(ModeEnum.LIST_VIEW);
  }

  isFiltered(): boolean {
    return this.table && (this.table.hasFilter() ||
      !!this.table.sortField && this.table?.sortField !== 'null');
  }

  clearFilters(): void {
    this.table.filters = {};
    this.table._sortField = 'null';
    this.table.reset();
  }

  getLink(pref: string, id: string | number, sfx: string): (string | number)[] {
    return [pref, id, sfx].filter(i => !!i);
  }

  onApplyFilter(event: KeyboardEvent | Event): void {
    if ((event instanceof KeyboardEvent && event.key === 'Enter')
      || event instanceof PointerEvent
      || event?.type === 'click') {
      Object.keys(this.form.value.filters).forEach(
        keys => {
          const column = this.strategy.columns.find(c => c.field === keys || c.searchSelector === keys);

          this.setFilter(
            column?.filterType === 'object-id' && this.form.value.filters[keys]
            && typeof this.form.value.filters[keys] === 'string'
              ? [this.form.value.filters[keys]]
              : this.form.value.filters[keys],
            column?.searchSelector || column?.rowSelector || keys,
            column?.searchType === 'text' ?
              'like'
              : column?.searchType === 'date' ? '>='
                : (column?.filterType === 'object-id'
                  || column?.filterType === 'id'
                  || column?.filterType === 'array') ? 'in' : '=',
            column?.searchType === 'date' ? 'ts' : column?.filterType || 'string');
        });

      this.initEvent();
    }
  }

  getMatchMade(field: string): string {
    return this.strategy.columns.find(column => column.field === field)?.searchType === 'text' ? 'like' : 'contains';
  }

  getFilterType(field: string): string {
    return this.strategy.columns.find(column => column.field === field)?.filterType || 'string';
  }

  onResetFilter(): void {
    this.table.filters = {};
    this.form.form.reset();
    this.table.reset();
    this.initEvent();
  }

  async openFiltersModal(): Promise<HTMLIonModalElement> {
    const modal = await this.modalController.create({
      id: 'filters-modal',
      initialBreakpoint: 0.5,
      breakpoints: [0, 0.25, 0.5, 1],
      showBackdrop: true,
      backdropDismiss: true,
      component: TableFiltersModalComponent,
      componentProps: {
        table: this.table,
        columns: this.strategy.columns,
        lazy: this.lazy,
        showedColumns: this.showedColumns,
      },
    });
    await modal.present();
    return modal;
  }

  isFieldFiltered(field: string): boolean {
    return !this.table?.isFilterBlank(field);
  }

  getFieldFilterValue(field: string): unknown {
    if (!this.isFieldFiltered(field) || !this.table?.filters || !(field in this.table.filters)) {
      return null;
    }

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

  presentMultiActionsPopover(e: Event): void {
    this.multiActionsPopover.event = e;
    this.isOpen = true;
  }

  showColumn(field: any): boolean {
    return field && this.showedColumns?.includes(field);
  }

  toggleShow(event: any, field: string): void {
    if (!event.detail.checked) {
      this.showedColumns = this.showedColumns.filter(i => i !== field);
    } else {
      this.showedColumns.push(field);
    }
  }

  presentShowPopover(e: Event): void {
    this.shoColumnPopover.event = e;
    this.isOpenVisibility = true;
  }

  onTextEdit(event: Event, row: any): void {
    row.changed = true;

    if (row[this.dataKey]) {
      row.status = 'edit';
    } else {
      row.status = 'new';
    }
  }

  hasAction(type: ActionEnum): boolean {
    return !this.actions.length || this.actions.some(action => action === type);
  }

  getIcon(type: ActionEnum): string {
    switch (type) {
      case ActionEnum.EDIT:
        return 'create-outline';
      case ActionEnum.DELETE:
        return 'trash-outline';
      case ActionEnum.DUPLICATE:
        return 'copy-outline';
      case ActionEnum.INFO:
        return 'information-circle-outline';
      case ActionEnum.SAVE:
        return 'save-outline';
      case ActionEnum.CANCEL:
        return 'sync-outline';
      case ActionEnum.ANALYSIS:
        return 'stats-chart-outline';
      default:
        return 'information-circle-outline';
    }
  }

  getColor(type: ActionEnum): string {
    switch (type) {
      case ActionEnum.DELETE:
        return 'danger';
      default:
        return 'primary';
    }
  }

  onAdd(): void {
    this.editActionEvent.emit({ type: EditActionEnum.ADD });
  }

  onSave(f: NgForm): void {
    const changedData = Object.keys(f.value)
      .filter((i: any) => this.data.find((j: any) => i === j.uuid).changed)
      .map((i: any) => f.value[i]);

    this.editActionEvent.emit({ rows: changedData, type: EditActionEnum.SAVE });
  }

  isChanged(): boolean {
    return !this.data.some((i: any) => i.changed);
  }

  hasErrorStatus(): boolean {
    return this.data.some((i: any) => i.status === 'error');
  }

  /**
   * setFilter
   * @type { value: any, field: string, matchMode: string, type: string}
   */
  private setFilter(value: any, field: string, matchMode: string, type: string): void {
    this.table.first = 0;

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
    if (this.table.sortField) {
      this.table.sortSingle();
    } else {
      this.table.reset();
    }

    this.form.controls['filters'].markAsPristine({ onlySelf: false });
  }

  onChange($event: any, row: any, field: string): void {
    this.onTextEdit($event, row);
    this.changeValueEvent.emit({ value: $event, field: field, row: row });
  }

  filteredOptions(options: any[], optionsFilter: string[] = [], row: any): any[] {
    return optionsFilter.length
      ? options.filter(o => optionsFilter.every(key => o[key] === row[key])) : options;
  }

  /**
   * selection
   */
  isChecked(id: any): boolean {
    return this.selectedData.find(i => i[this.dataKey] === id);
  }

  onSelectRow(event: any, row: any): void {
    if (event.detail.checked) {
      this.selectedData.push(row);
    } else {
      this.selectedData = this.selectedData.filter(i => i[this.dataKey] !== row[this.dataKey]);
    }

    this.cdr.detectChanges();
  }

  onSelectAllRow(event: any): void {
    if (event.detail.checked) {
      this.selectedData = [
        ...this.data
          .filter(i => !('isEditable' in i) || i.isEditable || !('isDeletable' in i) || i.isDeletable),
      ];
    } else {
      this.selectedData = [];
    }
  }

  isCheckedAll(): boolean {
    return !!this.data?.length && this.data
      ?.filter(i => !('isEditable' in i) || i.isEditable || !('isDeletable' in i) || i.isDeletable)
      .length === this.selectedData.length;
  }

  indeterminate(): boolean {
    return !!this.selectedData.length && !this.isCheckedAll();
  }

  onCleanSelectRow(): void {
    this.selectedData = [];
  }

  getId(row: any, rowSelector: string, optionsValue = ''): string {
    const selectors = rowSelector.split('.');
    selectors[selectors.length - 1] = optionsValue;

    let value = row;
    selectors.forEach(selector => {
      value = value && value[selector] ? value[selector] : (value[selector] === false ? false : null);
    });
    return value;
  }

  getColumnField(key: any): string {
    return this.strategy.columns.find(column => column.rowSelector === key)?.field || '';
  }

  onShowFilters(): void {
    this.showFilters = !this.showFilters;
  }

  getFields(field: string): any[] {
    return this.data.filter(d => !d.toBeDeleted).map(d => d[field]);
  }

  hasNoRepeatValidator(validators: any): boolean {
    return validators?.includes('noRepeat');
  }

  getError(row: any): string {
    let messages: string[] = [];
    const controls = this.form.controls[row.uuid] as any;

    if ('controls' in controls && typeof controls === 'object') {
      messages = Object.keys(controls.controls)
        .filter(key => controls.controls[key].status === 'INVALID')
        .map(key => {
          const errors = controls.controls[key].errors;
          const field = this.strategy.columns.find(column => column.rowSelector === key
            || column.rowEditSelector === key)?.field;

          const name = this.translocoService.translate(`table.${field}`);

          let message = '';
          if ('required' in errors) {
            message += `${name} ${this.translocoService.translate(`errors.required`)}. `;
          }

          if ('whiteSpace' in errors) {
            message += `${name} ${this.translocoService.translate(`errors.empty`)}. `;
          }

          if ('notRepeat' in errors) {
            message += `${name} ${this.translocoService.translate(`errors.notRepeat`)}. `;
          }

          return message;

        });
    }

    return messages.join('') + row.error || 'Invalid row';
  }

  canSave(): boolean {
    return !(this.form && Object.keys(this.form.controls)
      .every(key => this.form.controls[key].status === 'VALID' || this.form.value[key].toBeDeleted));
  }

  disabledReset(): boolean {
    const filters = this.filters && Object.keys(this.filters)
      .filter(f => (this.filters[f].value || this.filters[f].value === false)
        && !(Array.isArray(this.filters[f].value) && !this.filters[f].value.length))
      .length;
    const formFilters = this.form.value.filters && Object.keys(this.form.value.filters)
      .filter(f => this.form.value.filters[f]).length;

    return !(filters || formFilters);
  }
}

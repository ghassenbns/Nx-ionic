import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  Output,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, NgModel } from '@angular/forms';
import { IonContent, IonPopover, PopoverController } from '@ionic/angular';

import { SelectOption } from '../../interfaces';
import { Items } from '../search-select-popover/search-select-popover.component';

export interface GroupItems {
  group: number;
  value: SelectOption[];
}

@Component({
  selector: 'concordia-ng-shared-search-multi-select',
  templateUrl: './search-multi-select.component.html',
  styleUrls: ['./search-multi-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchMultiSelectComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => SearchMultiSelectComponent),
      multi: true,
    },
  ],
})
export class SearchMultiSelectComponent implements ControlValueAccessor, OnChanges {
  @ViewChild(IonContent) content!: IonContent;
  @ViewChild('popover') popover!: IonPopover;
  @ViewChild(NgModel) ngModel!: NgModel;
  @ViewChildren('item') item!: any;

  @Input() label = '';
  @Input() name = '';
  @Input() errorText = '';
  @Input() placeholder = '';
  @Input() fill = '';
  @Input() rowSelector = '';
  @Input() optionsField = 'name';
  @Input() optionsValue = '';
  @Input() optionsGroup = '';

  @Input() required = false;
  @Input() validators: any[] = [];
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() viewSwitch = false;

  @Input() options!: SelectOption[] | any[];
  optionsGrouped: GroupItems[] = [];

  private _innerModel: any[] | null = null;

  get model(): any[] | null {
    return this._innerModel;
  }

  set model(newValue: any[] | null) {
    this._innerModel = newValue;
    this.onChange(this._innerModel);
  }

  private _setTouched!: boolean | null;

  @Input() get setTouched(): any {
    return this._setTouched;
  }

  set setTouched(newValue: any) {
    this._setTouched = newValue;

    if(newValue) {
      this.ngModel.control.markAsTouched();
    }
  }

  search = '';
  isOpen = false;

  groupOptions: Items = {};

  @Output() changeValue = new EventEmitter<any>();

  constructor(
      public popoverController: PopoverController,
  ) {
  }

  ngOnChanges(changes: any): void {
    const group = changes.optionsGroup?.currentValue || this.optionsGroup;

    if(group && (changes.optionsGroup?.currentValue || changes.options?.currentValue)) {
      const options = changes.options?.currentValue || this.options;

      this.optionsGrouped = options
        .reduce((acc: any, key: any) => {
          const groupLevel = key[group];
          const item = acc.find((i: GroupItems) => i.group === groupLevel);

          if(item) {
            item.value.push(key);
          } else {
            acc.push({
              group: groupLevel,
              value: [key],
            });
          }

          return acc;
        }, []);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onChange: any = () => {};

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched: any = () => {};

  writeValue(obj: any[]): void {
    this._innerModel = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  validate(): any {
    return !this.required || this.model ? null : { required: true };
  }

  getValues(model: any[] | null): string {
    return this.options && model?.length
      ? this.options
        .filter((i: any) => model.includes(i[this.getOptionsValue()]))
        .map((i: any) => i[this.optionsField]).join(', ')
      : '';
  }

  getOptionsValue(): string {
    return this.optionsValue || '_id';
  }

  onInput(event: any): void {
    if(!event.detail.value){
      this.setValue(null);
    }
  }

  setValue(val: any[] | null): void {
    this._innerModel = val;
    this.onChange(val);
    this.changeValue.emit(val);
  }

  onSelectOption(event: any, option: SelectOption): void {
    event.stopPropagation();

    const val = event.detail.checked
      ? [
        ...this._innerModel ? this._innerModel : [],
        option[this.getOptionsValue()],
      ]
      : this._innerModel?.filter(i => i !== option[this.getOptionsValue()]) ?? null;

    this.setValue(val?.length ? val : null);
  }

  filteredOption(): SelectOption[] {
    return this.options
      .filter(o => !this.search || o[this.optionsField].toLowerCase().includes(this.search.toLowerCase()));
  }

  isChecked(value: string | number | boolean | null | undefined): boolean {
    return !!this._innerModel?.includes(value);
  }

  onSetValue(optionElement: any): void {
    const val = this._innerModel?.some(i => i === optionElement)
      ? this._innerModel?.filter(i => i !== optionElement)
      : [
        ...this._innerModel ? this._innerModel : [],
        optionElement,
      ];

    this.setValue(val);
  }

  presentPopover(event: Event): void {
    if(this.disabled || this.readonly || !this.options.length) {
      return;
    }

    this.popover.event = event;
    this.isOpen = true;

    const index = this.options.findIndex(o => this._innerModel?.includes(o[this.optionsValue]));

    setTimeout(() => {

      this.content?.scrollByPoint(0, index*48, 300);

    }, 100);
  }

  showItemTitle(value: string, search: string): boolean {
    return !search || value.toLowerCase().includes(search.toLowerCase());
  }

  showGroupTitle(value: SelectOption[], search: string): boolean {
    return !search || value.some(j => j[this.optionsField]?.toString().toLowerCase().includes(search.toLowerCase()));
  }

  noData(options: SelectOption[], search: string): boolean {
    return !options.some(
      (i: SelectOption) =>
        typeof i[this.optionsField] === 'string' &&
        i[this.optionsField].toLocaleLowerCase().includes(search.toLocaleLowerCase()),
    );
  }
}

import { Component, EventEmitter, forwardRef, Input, Output, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, NgModel } from '@angular/forms';
import { IonInput, PopoverController, PopoverOptions } from '@ionic/angular';

import { SelectOption } from '../../interfaces';
import { SearchSelectPopoverComponent } from '../search-select-popover/search-select-popover.component';

@Component({
  selector: 'concordia-ng-shared-select-search',
  templateUrl: './select-search.component.html',
  styleUrls: ['./select-search.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectSearchComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => SelectSearchComponent),
      multi: true,
    },
  ],
})
export class SelectSearchComponent implements ControlValueAccessor {
  @ViewChild(NgModel) ngModel!: NgModel;
  @ViewChild('input') input!: IonInput;

  @Input() label = '';
  @Input() name = '';
  @Input() errorText = '';
  @Input() placeholder = '';
  @Input() fill = '';
  @Input() rowSelector = '';
  @Input() optionsField = 'name';
  @Input() optionsValue = '';
  @Input() optionsGroup = '';
  @Input() viewSwitch = false;

  @Input() popoverOptions?: Omit<PopoverOptions, 'component'>;

  @Input() required = false;
  @Input() validators: any[] = [];
  @Input() disabled = false;
  @Input() readonly = false;

  @Input() options!: SelectOption[];

  private _innerModel!: string;
  private open = false;

  get model(): string {
    return this._innerModel;
  }

  set model(newValue: string) {
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

  @Output() changeValue = new EventEmitter<any>();

  constructor(
    public popoverController: PopoverController,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onChange: any = () => {};

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched: any = () => {};

  writeValue(obj: string): void {
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

  getValue(model: string): string | boolean {
    const option = this.options?.find(i => i[this.getOptionsValue()] === model);
    return option ? option[this.optionsField] : '';
  }

  getOptionsValue(): string {
    return this.optionsValue || '_id';
  }

  showPopover(e: Event): void {
    if(!this.open) {
      this.open = true;
      this.presentPopover(e).then();
    }
  }

  async presentPopover(e: Event): Promise<void> {
    if(this.disabled || this.readonly || !this.options.length) {
      this.open = false;

      return;
    }

    const popover = await this.popoverController.create({
      component: SearchSelectPopoverComponent,
      componentProps: {
        data: this.options,
        group: this.optionsGroup,
        field: this.optionsField,
      },
      event: e,
      showBackdrop: false,
      size: this.viewSwitch ? 'auto' : 'cover',
      trigger: 'cover-trigger',
      ...this.popoverOptions,
    });

    await popover.present();

    const eventDetail = await popover.onDidDismiss();

    this.open = false;

    if(eventDetail.data) {
      this.setValue(eventDetail.data[this.getOptionsValue()]);
    }
  }

  onInput(event: any): void {
    if(!event.detail.value){
      this.setValue(null);
    }
  }

  setValue(val: any): void {
    this._innerModel = val;
    this.onChange(val);
    this.changeValue.emit(val);
    this.input.setFocus().then();
  }
}

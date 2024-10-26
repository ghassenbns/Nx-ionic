import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UINotificationStateService } from '@concordia-nx-ionic/concordia-ui';
import { ModalController } from '@ionic/angular';
import { IonModal } from '@ionic/angular';
import { TranslocoService } from '@ngneat/transloco';

import { ModeEnum } from '../../enum';
import { Column, Strategy } from '../../interfaces';

@Component({
  selector: 'concordia-ng-shared-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.scss'],
})
export class EditItemComponent {
  @ViewChild(IonModal) modal!: IonModal;
  @ViewChild(NgForm) form!: NgForm;
  @Input() strategy!: Strategy;

  _model: any = {};
  @Input() set model(s: any) {
    this._model = {
      ...this._model = this.strategy.columns
        .filter(i => i.defaultValue || i.defaultValue === false)
        .reduce((acc: any, key: any) => {
          acc[key.rowEditSelector || key.rowSelector] = key.defaultValue;
          return acc;
        }, {}),
      ...s,
    };
  }

  @Input() loading!: boolean;
  @Input() clone = false;
  @Input() readonlyFields: string[] = [];
  @Input() modalId = '';
  @Input() modelIdField = '_id';
  @Output() changeValueEvent = new EventEmitter<{ value: any, rowSelector: string, form: any }>();
  @Output() editEvent = new EventEmitter<any>();
  @Output() storeEvent = new EventEmitter<any>();
  @Output() submitEvent = new EventEmitter<NgForm>();

  full = false;

  constructor(
    private modalCtrl: ModalController,
    private readonly notificationService: UINotificationStateService,
    private readonly translocoService: TranslocoService,
  ) {
  }

  cancel(data: unknown = null): Promise<boolean> {
    return this.modalCtrl.dismiss(data, 'cancel');
  }

  toggle(data: boolean): void {
    const selector = document.querySelector(`#${this.modalId}`);

    if (selector) {
      this.full = !data;
      selector.classList.toggle('w-full', this.full);
    }
  }

  onSubmit(f: NgForm): void {
    this.submitEvent.emit(f);

    if (f.invalid) {
      this.form.control.markAllAsTouched();
      this.notificationService.error(
        this.translocoService.translate(`errors.notEmptyError`),
      );
    } else if (f.value[this.modelIdField]) {
      this.editEvent.emit(f.value);
    } else {
      this.storeEvent.emit(f.value);
    }
  }

  onChange($event: any, rowSelector: string): void {
    this.changeValueEvent.emit({ value: $event, rowSelector: rowSelector, form: this.form.value });
  }

  setOption(field: string, data: any[]): void {
    this.strategy.columns.forEach(i => {
      if (i.field === field) {
        i.options = data;
      }
    });
  }

  canView(column: any): boolean {

    return !(!this._model._id && column?.hidden?.includes(ModeEnum.SINGLE_CREATE)
      || this._model._id && column?.hidden?.includes(ModeEnum.SINGLE_EDIT));

  }

  isReadonlyFields(column: Column): boolean {
    return this.readonlyFields?.includes(column.rowEditSelector ?? column.rowSelector);
  }

  group(rowSelector: string): string {
    const g = rowSelector.split('.');

    return g.length > 1 ? g[0] : '';
  }

  selector(rowSelector: string): string {
    return rowSelector.split('.')[1];
  }

  getModel(_model: any, field: string): any {
    const arr = field.split('.');

    return arr.reduce((acc: any, key: any) => {
      return acc[key];
    }, _model);
  }

  onToggle(selector: string, modelElement: any): void {
    this._model[selector] = !modelElement;
  }
}

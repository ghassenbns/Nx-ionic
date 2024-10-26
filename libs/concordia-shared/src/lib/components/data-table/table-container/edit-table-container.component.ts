import { Component, Input, OnDestroy } from '@angular/core';
import { UINotificationStateService } from '@concordia-nx-ionic/concordia-ui';
import { ModalController, NavParams } from '@ionic/angular';
import { TranslocoService } from '@ngneat/transloco';
import { first, noop, Observable, Subject } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

import { ActionEnum, EditActionEnum } from '../../../enum';
import { ActionEvent, EditActionEvent, Strategy } from '../../../interfaces';
import { resetValue } from '../../../utils';

@Component({
  selector: 'concordia-ng-shared-table-container',
  template: `<ng-content></ng-content>`,
})
export override abstract class EditTableContainerComponent<T> implements OnDestroy {

  @Input() entityKeyField = '_id';
  strategy!: Strategy;
  selectedData: any = { data: [] };
  currentData!: any[];
  loading: any;
  private destroy$ = new Subject<void>();

  protected constructor(
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public readonly translocoService: TranslocoService,
    public notificationService: UINotificationStateService,
  ) {
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  setData(): void {
    this.selectedData = {
      data: this.navParams.get('data')?.map((i: any) => ({
          ...i,
          uuid: uuidv4(),
          status: 'edit',
          error: '',
          changed: false,
          toBeDeleted: false,
        }),
      ) || [],
    };

    this.currentData = JSON.parse(JSON.stringify(this.selectedData.data));
  }

  updateData(): void {
    this.selectedData = JSON.parse(JSON.stringify(this.selectedData));
  }

  setOption(field: string, data: any[], add = false): void {
    this.strategy.columns.forEach(i => {
      if (i.field === field) {
        i.options = add
          ? [
            ...i.options,
            ...data,
          ]
          : data;
      }
    });
  }

  onClose(data: any = null): Promise<boolean> {
    return this.modalCtrl.dismiss(data, 'cancel');
  }

  actionEvent(event: ActionEvent): void {
    switch (event.type) {
      case ActionEnum.DELETE:
        return this.delete(event.row);
      case ActionEnum.DUPLICATE:
        return this.duplicate(event.row);
      case ActionEnum.CANCEL:
        return this.cancel(event.row.uuid);
      default:
        throw new Error('Invalid action type');
    }
  }

  delete(row: any): void {
    if (row.status === 'new') {
      const rows = this.selectedData?.data.filter((i: any) => i.uuid !== row.uuid);
      this.selectedData = {
        data: [...rows],
      };
    } else {
      row.toBeDeleted = !row.toBeDeleted;
      row.changed = true;
    }

    this.updateHidden();
  }

  duplicate(row: any): void {
    const clone = this.translocoService.translate('global.clone');

    this.selectedData = {
      data: [
        ...this.selectedData.data,
        {
          ...row,
          name: `${row.name} ${clone}`,
          [this.entityKeyField]: null,
          uuid: uuidv4(),
          status: 'new',
          error: '',
          changed: true,
        },
      ],
    };
  }

  cancel(uuid: string): void {
    this.selectedData = {
      data: this.selectedData.data.map(
        (row: any) => {
          const data = this.currentData.find((j: any) => j.uuid === uuid);
          return row.uuid !== uuid
            ? row
            : data ? { ...data } : this.newRow();
        },
      ),
    };

    this.updateHidden();
  }

  updateHidden(): void {
    this.updateData();
  }

  editActionEvent(event: EditActionEvent): void {
    switch (event.type) {
      case EditActionEnum.ADD:
        return this.add();
      case EditActionEnum.SAVE:
        return event.rows?.length ? this.save(event.rows) : noop();
      default:
        throw new Error('Invalid action type');
    }
  }

  add(): void {
    this.selectedData = {
      data: [
        ...this.selectedData.data,
        this.newRow(),
      ],
    };
  }

  newRow(): any {
    const obj = this.strategy.columns.reduce((o, key: any) => ({
      ...o, [key.rowEditSelector || key.rowSelector]:
        key.defaultValue ? key.defaultValue : resetValue(key.contentType),
    }), {});

    return {
      ...obj,
      uuid: uuidv4(),
      status: 'new',
      error: '',
      changed: false,
    };
  }

  save(row: Partial<T>[]): void {
    const newItem = row.filter((d: any) => !d[this.entityKeyField]);
    if (newItem.length) {
      this.storeMany(newItem);
    }

    const editItem = row.filter((d: any) => d[this.entityKeyField] && !d.toBeDeleted);
    if (editItem.length) {
      this.editMany(editItem);
    }

    const deleteItem = row.filter((d: any) => d.toBeDeleted);
    if (deleteItem.length) {
      this.deleteMany(deleteItem);
    }
  }

  abstract storeMany(ids: any[]): void;

  addMany(items: any[]): void {
    this.selectedData = {
      data: this.selectedData.data.map((j: any) => {
        const newData = items.find((d: any) => d.uuid === j.uuid);
        const data = {
          ...newData,
          status: 'done',
          error: '',
          changed: false,
          toBeDeleted: false,
        };

        if (newData) {
          this.currentData.push(data);
        }

        return newData
          ? data
          : j;
      }),
    };
  }

  abstract editMany(ids: any[]): void;

  updateMany(items: any[]): void {
    this.selectedData = {
      data: this.selectedData.data.map((j: any) => {
        const data = items.find((d: any) => d[this.entityKeyField] === j[this.entityKeyField]);

        return data
          ? {
            ...data,
            uuid: j.uuid,
            status: 'done',
            error: '',
            changed: false,
            toBeDeleted: false,
          }
          : j;
      }),
    };

    this.currentData = JSON.parse(JSON.stringify(this.currentData.map((j: any) => {
        const data = items.find((d: any) => d[this.entityKeyField] === j[this.entityKeyField]);
        return {
          ...j,
          ...data && data,
          changed: false,
        };
      },
    )));
  }

  abstract deleteMany(ids: any[]): void;

  removeMany(items: any[]): void {
    this.selectedData = {
      data: this.selectedData.data.filter((j: any) => {
        return !items.some(t => t[this.entityKeyField] === j[this.entityKeyField]);
      }),
    };
  }

  setError(error: any): void {
    if (error) {
      this.selectedData = {
        data: this.selectedData.data.map((j: any) => {
          const item = error.data?.errors?.filter((d: any) => d[this.entityKeyField] === j[this.entityKeyField]
              || d.uuid === j.uuid)
            || error.data?.find((d: any) => d[this.entityKeyField] === j[this.entityKeyField] || d.uuid === j.uuid)
            || error.data[0].errors?.filter((d: any) => d[this.entityKeyField] === j || d.uuid === j.uuid);

          return item.errors || item.length
            ? {
              ...j,
              status: 'error',
              error: item.errors
                  ?.map((i: any) => 'errorDetails' in i
                    ? i.errorDetails.join(' ')
                    : this.translocoService.translate(`COMMON_SERVER_ERRORS.${i.errorCode}`)).join(' ')
                || j.error + item
                  .map((i: any) => 'errorDetails' in i
                    ? i.errorDetails.join(' ')
                    : this.translocoService.translate(`COMMON_SERVER_ERRORS.${i.errorCode}`)).join(' '),
            }
            : j;
        }),
      };
    }
  }

  closeModal(data: unknown = true): void {
    if (!this.isLoading()
      && !this.selectedData.data.find((j: any) => !!j.error)
      && !this.selectedData.data.find((j: any) => j.changed)) {
      this.onClose(data).then();
    }
  }

  isLoading(): boolean {
    return Object.values(this.loading).some(i => i);
  }

  translate(messageSelector: string, options?: { [key: string]: string | number }): Observable<string> {
    return this.translocoService
      .selectTranslate(messageSelector, options)
      .pipe(first());
  }
}

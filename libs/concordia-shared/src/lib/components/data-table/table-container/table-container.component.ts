import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UINotificationStateService } from '@concordia-nx-ionic/concordia-ui';
import { TranslocoService } from '@ngneat/transloco';
import { first, Observable, Subject, takeUntil, tap } from 'rxjs';

import { ActionEnum, MultiActionEnum } from '../../../enum';
import { ActionEvent, MultiActionEvent, Strategy } from '../../../interfaces';
import { DEFAULT_LENGTH } from '../../../interfaces/table-consts';
import { FiltersInterface, TableEventInterface, TableSortInterface } from '../../../models/table-data';
import { routeFiltersInterface, TableFiltersInterface } from '../../../models/table-data/table-filters';
import { AlertService } from '../../../services';
import { paramsFn } from '../../../utils';

@Component({
  selector: 'concordia-ng-shared-table-container',
  template: `<ng-content></ng-content>`,
})
export override abstract class TableContainerComponent implements OnInit, OnDestroy {
  @Input() routing = false;
  @Input() hiddenColumns: string[] = [];
  @Input() actions: string[] = [];
  //identifies the field to be used as entity primary key
  @Input() dataKey = '_id';
  //identifies the field to be used as entity informative attribute
  //eg. in delete alerts
  @Input() dataLabel = 'name';

  currentEvent!: TableEventInterface;
  loading = false;
  start = false;
  sort!: TableSortInterface[];
  filters!: TableFiltersInterface;
  strategy!: Strategy;

  canDelete$!: Observable<boolean>;
  canEdit$!: Observable<boolean>;

  destroy$ = new Subject<void>();

  protected constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    public translocoService: TranslocoService,
    public notificationService: UINotificationStateService,
  ) {
  }

  ngOnInit(): void {
    if (this.routing) {
      this.route.queryParams
        .pipe(
          takeUntil(this.destroy$),
        )
        .pipe(
          tap(queryParams => {
            this.start = false;

            this.sort = queryParams['sort']
              ? JSON.parse(queryParams['sort'])
              : [];

            this.filters = queryParams['filter'] ? JSON.parse(queryParams['filter'])
                .reduce((acc: FiltersInterface, key: routeFiltersInterface) => {
                  acc[key.scope] = {
                    value: key.value,
                    matchMode: key.operator,
                    type: key.type,
                  };

                  return acc;
                }, {})
              : {};
          }),
          tap(queryParams => this.loadEvent({
            ...queryParams['page'] && { first: (+queryParams['page'] - 1) * (+queryParams['length'] || DEFAULT_LENGTH) },
            ...queryParams['length'] && { rows: +queryParams['length'] },
            filters: this.filters,
            ...(this.sort.length && this.sort[0].scope) && {
              sortField: this.sort[0].scope,
              sortOrder: this.sort[0].value === 'asc' ? 1 : -1,
            },
          })),
        ).subscribe();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  goTo(event: TableEventInterface): void {
    if (this.routing) {
      if (this.start) {
        this.router.navigate([],
          { queryParams: { ...paramsFn(event, true).params } })
          .then();
      } else {
        this.start = true;
      }

    } else {
      this.loadEvent(event);
    }

  }

  actionEvent($event: ActionEvent): unknown {
    switch ($event.type) {
      case ActionEnum.ADD:
        return this.add();
      case ActionEnum.BULK_ADD:
        return this.multiEdit([]);
      case ActionEnum.INFO:
        return this.info($event.row);
      case ActionEnum.EDIT:
        return this.edit($event.row);
      case ActionEnum.DELETE: {
        const names = [$event.row[this.dataLabel]];
        return this.presentDeleteAlert(names, [{ [this.dataKey]: $event.row[this.dataKey] }]);
      }
      case ActionEnum.DUPLICATE:
        return this.duplicate($event.row);
      case ActionEnum.ANALYSIS:
        return this.analysis($event.row);
      case ActionEnum.ACTIVATE:
        return this.changeActive([$event.row], true);
      case ActionEnum.DEACTIVATE:
        return this.changeActive([$event.row], false);
      default:
        throw new Error('Invalid action type');
    }
  }

  multiActionEvent($event: MultiActionEvent): any {
    switch ($event.type) {
      case MultiActionEnum.ACTIVATE:
        return this.changeActive($event.rows, true);
      case MultiActionEnum.DEACTIVATE:
        return this.changeActive($event.rows, false);
      case MultiActionEnum.EDIT:
        return this.multiEdit($event.rows);
      case MultiActionEnum.DELETE: {
        const names = $event.rows.map(row => row[this.dataLabel] || row.label);

        const disabledNames = $event.rows
          .filter(row => ('isDeletable' in row) && !row.isDeletable)
          .map(row => `"${row[this.dataLabel]}"`);

        const disabledNamesString = disabledNames.join(', ');
        const ids = $event.rows.map(row => ({ [this.dataKey]: row[this.dataKey] }));

        return !disabledNamesString
          ? this.presentDeleteAlert(names, ids)
          : this.translate('errors.recordCannotBeDeleted', {
            count: disabledNames.length,
            records: disabledNamesString,
          })
            .subscribe((message) => this.notificationService.error(message));
      }

      default:
        throw new Error('Invalid action type');
    }
  }

  abstract loadEvent(event: any): void;

  abstract info(event: any): void;

  abstract add(): void;

  abstract edit(event: any): void;

  abstract delete(ids: any[]): void;

  abstract changeActive(rows: any[], event: boolean): void;

  // eslint-disable-next-line
  duplicate(row: any): void {
  }

  // eslint-disable-next-line
  analysis(row: any): void {
  }

  // eslint-disable-next-line
  multiEdit(rows: any[]): void {
  }

  async presentDeleteAlert(names: string[], ids: any[]): Promise<void> {
    await this.alertService.show(
      {
        header: 'global.warning',
        message: 'errors.recordDeleteConfirmation',
        buttons: [
          {
            text: 'global.cancel',
            role: 'cancel',
          },
          {
            text: 'global.ok',
            role: 'confirm',
            handler: () => this.delete(ids),
          },
        ],
      },
      true,
      { message: { count: names.length, records: names.join(', ') } },
    );
  }

  translate(messageSelector: string, options?: { [key: string]: string | number }): Observable<string> {
    return this.translocoService
      .selectTranslate(messageSelector, options)
      .pipe(first());
  }

  setOption(field: string, data: any[]): void {
    this.strategy.columns.forEach(i => {
      if (i.field === field) {
        i.options = data;
      }
    });
  }
}

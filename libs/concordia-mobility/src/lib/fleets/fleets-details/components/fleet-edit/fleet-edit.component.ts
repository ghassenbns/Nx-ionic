import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import {
  FleetDataInterface,
  FleetsApiService,
  RelatedUsersApiService,
  TripsDataInterface,
  UserRelationInterface,
} from '@concordia-nx-ionic/concordia-mobility-api';
import { ManagerInterface } from '@concordia-nx-ionic/concordia-shared';
import { UINotificationStateService } from '@concordia-nx-ionic/concordia-ui';
import { TranslocoService } from '@ngneat/transloco';
import { finalize, first, map, tap } from 'rxjs';

@Component({
  selector: 'concordia-nx-ionic-fleet-edit',
  templateUrl: './fleet-edit.component.html',
  styleUrls: ['./fleet-edit.component.scss'],
})
export class FleetEditComponent implements OnInit {
  item!: any;
  managers: ManagerInterface[] = [];
  managersEdit: ManagerInterface[] = [];

  private _fleet!: FleetDataInterface;

  @Input() loading = false;
  @Input() set fleet(f: FleetDataInterface | null) {
    if(f){
      this.form?.resetForm();

      this.item = JSON.parse(JSON.stringify(f));
      this._fleet = JSON.parse(JSON.stringify(f));

      if(f.isOwnerEditable) {
        this.getManagers(f._id, f.ownerId);
      } else {
        this.managers = f.managersDetails;
      }
    }
  }

  get fleet(): FleetDataInterface {
    return this._fleet;
  }

  @Output() submitted = new EventEmitter<TripsDataInterface>();
  @ViewChild(NgForm) form!: NgForm;

  listOwners: UserRelationInterface[] = [];

  editMode = false;
  currentLoading = false;

  constructor(
    private readonly relatedUsersApiService: RelatedUsersApiService,
    private readonly fleetsService: FleetsApiService,
    private readonly notificationService: UINotificationStateService,
    private readonly translocoService: TranslocoService,
  ) {
  }

  ngOnInit(): void {
    this.relatedUsersApiService.listOwners()
      .pipe(
        first(),
        map(o => o.data),
        tap((i: UserRelationInterface[]) => {
          this.listOwners = i;
        }),
      ).subscribe();
  }

  onSubmit(f: NgForm): void {
    if(f.valid) {
      this.currentLoading = true;

      this.fleetsService.edit(
        f.value,
      )
        .pipe(
          first(),
          finalize(() => {
            this.currentLoading = false;
          }),
        ).subscribe(
        ({ data }: any) => {
          this.editMode = false;
          this.form.resetForm();
          this.submitted.emit(data);
        },
        ({ error }) => {
          this.notificationService.error(
            error.data.errors
              .map((i: any) =>
                'errorDetails' in i
                  ? i.errorDetails.join(' ')
                  : this.translocoService.translate(`COMMON_SERVER_ERRORS.${i.errorCode}`)).join(' '),
          );
        },
      );
    } else {
      this.form.control.markAllAsTouched();
      this.notificationService.error(
        this.translocoService.translate(`errors.notEmptyError`),
      );
    }

  }

  onCancel(): void {
    this.editMode = false;
    this.form.resetForm();
    this.item = JSON.parse(JSON.stringify(this.fleet));
    this.managersEdit = [];
  }

  onChange(event: string, managers: string[]): void {
    if(!managers.find((i: string) => i === event)) {
      managers.push(event);
    }

    this.getManagers(this.fleet._id, event, true);
  }

  getManagers(id: string, ownerId: string | number, edit = false): void {
    this.relatedUsersApiService.listManagersByFleet(id, { params: { ownerId: ownerId } })
      .pipe(
        first(),
        map(o => o.data),
      ).subscribe(managers => {
        if(edit) {
          this.managersEdit = managers.map((i: any) => ({ ...i, hidden: i.userId === this.item.ownerId }));

          this.form.setValue({
            ...this.form.value,
            managerIds: this.form.value.managerIds.filter((i: string) => managers.find(m => m.userId === i)),
          });
        } else {
          this.managers = managers?.map((i: any) => ({ ...i, hidden: i.userId === this.item.ownerId }));
        }
    });
  }

  toggleEditMode(b: boolean): void {
    this.editMode = b;
  }

  getManagersNames(managersDetails: ManagerInterface[]): string {
    return managersDetails.map(i => i.name).join(', ') || 'n/a';
  }
}

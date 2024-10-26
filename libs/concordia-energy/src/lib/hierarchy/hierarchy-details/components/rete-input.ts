import { AfterContentInit, Component, Input, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { ClassicPreset } from 'rete';
import { Observable, of, Subject } from 'rxjs';

export class ReteInputControl extends ClassicPreset.Control {
  private _touched: Subject<boolean> = new Subject();

  constructor(public label: string,
              public value: string | null,
              public readonly = false,
              public change: ($event: any) => any,
              public required = false,
              public touched$: Observable<boolean> = of(false),
              ) {
    super();

    this.touched$ = this._touched.asObservable();
  }

  setValue(value: string | null): void {
    this.value = value;
  }

  setTouched(): void {
    this._touched.next(true);
  }
}

@Component({
  selector: 'concordia-nx-ionic-hierarchy-rete-input',
  template: `
      <ion-list lines="none"
                class="ion-no-padding ion-no-margin">
          <ion-item>
              <ion-input #ngModel="ngModel"
                         [label]="data.label"
                         [(ngModel)]="data.value"
                         [required]="data.required"
                         [errorText]="'errors.invalidField' | transloco"
                         [readonly]="data.readonly"
                         ngModel
                         aria-label="input"
                         labelPlacement="stacked"
                         (pointerdown)="$event.stopPropagation()"
                         (ionChange)="data.change($event)"></ion-input>
          </ion-item>
      </ion-list>
  `,
})
export class ReteInputComponent implements AfterContentInit {
  @ViewChild(NgModel) ngModel!: NgModel;
  @Input() data!: ReteInputControl;

  ngAfterContentInit(): void {
    this.data.touched$.subscribe(() => {
      this.ngModel?.control.markAsTouched();
    });
  }
}

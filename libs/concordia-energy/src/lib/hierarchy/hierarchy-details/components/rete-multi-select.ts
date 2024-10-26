import { Component, Input } from '@angular/core';
import { ClassicPreset } from 'rete';

export class ReteMultiSelectControl extends ClassicPreset.Control {
  constructor(public param: any, public value: any[], public items: any[], public onChange: ($event: any) => any) {
    super();
  }

  setValue(value: any[]): void {
    this.value = value;
  }

  setItems(items: any[]): void {
    this.items = items;
  }

  setDisabled(disabled: boolean): void {
    this.param.disabled = disabled;
  }
}

@Component({
  selector: 'concordia-nx-ionic-hierarchy-rete-input',
  template: `
    <ion-list class="ion-no-padding ion-no-margin">
      <ion-item>
        <concordia-ng-shared-search-multi-select ngModel
                                                 #hierarchyId="ngModel"
                                                 [(ngModel)]="data.value"
                                                 [label]="data.param.label"
                                                 [options]="data.items || []"
                                                 [placeholder]="'placeholder'"
                                                 [disabled]="data.param.disabled"
                                                 [viewSwitch]="true"
                                                 [optionsField]="data.param.optionsField"
                                                 [optionsValue]="data.param.optionsValue"
                                                 (pointerdown)="$event.stopPropagation()">
        </concordia-ng-shared-search-multi-select>
      </ion-item>
    </ion-list>
  `,
})
export class ReteMultiSelectComponent {
  @Input() data!: ReteMultiSelectControl;
  @Input() disabled = false;
}

import { Component, Input } from '@angular/core';
import { ClassicPreset } from 'rete';

export class ReteSelectControl extends ClassicPreset.Control {
  constructor(public label: string, public value: any, public items: any[], public onChange: ($event: any) => any) {
    super();
  }

  setValue(value: any): void {
    this.value = value;
  }

  setItems(items: any[]): void {
    this.items = items;
  }
}

@Component({
  selector: 'concordia-nx-ionic-hierarchy-rete-input',
  template: `
    <ion-list class="ion-no-padding ion-no-margin">
      <ion-item>
        <concordia-ng-shared-select-search ngModel
                                           #hierarchyId="ngModel"
                                           [(ngModel)]="data.value"
                                           [label]="data.label"
                                           [options]="data.items || []"
                                           [placeholder]="'placeholder'"
                                           [viewSwitch]="true"
                                           [required]="true"
                                           optionsGroup="userLevelId"
                                           optionsField="name"
                                           optionsValue="userId"
                                           (pointerdown)="$event.stopPropagation()"
                                           (changeValue)="data.onChange($event)">
        </concordia-ng-shared-select-search>
      </ion-item>
    </ion-list>
  `,
})
export class ReteSelectComponent {
  @Input() data!: ReteSelectControl;
  @Input() disabled = false;
}

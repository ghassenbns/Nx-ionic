import { Component, Input } from '@angular/core';
import { ClassicPreset } from 'rete';

export class DeleteButtonControl extends ClassicPreset.Control {
  constructor(public label: string, public onClick: () => void) {
    super();
  }
}

@Component({
  selector: 'concordia-nx-ionic-hierarchy-button',
  template: `
    <ion-button shape="round"
                color="danger"
                (pointerdown)="$event.stopPropagation()"
                (dblclick)="$event.stopPropagation()"
                (click)="data.onClick()">
      <ion-icon slot="icon-only"
                name="trash-outline"></ion-icon>
    </ion-button>
  `,
  styles: [`
    :host {
      display: block;
      text-align: right;
    }
  `],
})
export class DeleteButtonComponent {
  @Input() data!: DeleteButtonControl;
}

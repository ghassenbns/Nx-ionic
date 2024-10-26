import { Component, Input } from '@angular/core';
import { ClassicPreset } from 'rete';

export class ReteToggleControl extends ClassicPreset.Control {
  constructor(public label: string, public value: boolean, public disabled: boolean, public onClick: () => any) {
    super();
  }

  setValue(value: boolean): void {
    this.value = value;
  }

  toggleValue(): void {
    this.value = !this.value;
  }
}

@Component({
  selector: 'concordia-nx-ionic-hierarchy-rete-input',
  template: `
    <ion-list lines="none"
              class="ion-no-padding ion-no-margin">
      <ion-item>
        <ion-text [color]="data.disabled ? 'medium':''"
                   class="w-100 cursor-pointer ion-no-margin line-height-38">
          {{data.label}}
        </ion-text>
        <ion-toggle aria-label="toggle"
                    class="toggle"
                    [checked]="data.value"
                    [disabled]="data.disabled"></ion-toggle>
      </ion-item>
    </ion-list>
    <button *ngIf="!data.disabled"
            class="button"
            (pointerdown)="$event.stopPropagation()"
            (dblclick)="$event.stopPropagation()"
            (click)="data.onClick()">
    </button>
  `,
  styles: [`
    :host {
      position: relative;

      .button {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        opacity: 0;
      }

      .toggle {
        width: 40px;
      }
    }
  `],
})
export class ReteToggleComponent {
  @Input() data!: ReteToggleControl;
}

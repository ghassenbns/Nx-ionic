import { Component, Input } from '@angular/core';

@Component({
  selector: 'concordia-ng-shared-card-accordion',
  templateUrl: './card-accordion.component.html',
})
export class CardAccordionComponent {
  @Input() header = '';
  @Input() disabled = false;

  @Input() isOpen = false;

  onOpen(): void {
    if (this.disabled) {
      return;
    }

    this.isOpen = !this.isOpen;
  }
}

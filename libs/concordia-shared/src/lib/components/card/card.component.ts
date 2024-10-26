import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { BooleanState } from '../../interfaces';
import { CardConfigInterface } from '../../interfaces/card/card-config';

@Component({
  selector: 'concordia-ng-shared-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
  /**
   * Actual edit mode state, required when cardConfig.editable is set to true
   * @type {BehaviorSubject<BooleanState>}
   * @memberof CardComponent
   */
  @Input() editMode!: BehaviorSubject<BooleanState>;
  /**
   * Card config object, required input
   * @type {CardConfigInterface}
   * @memberof CardComponent
   */
  @Input() cardConfig!: CardConfigInterface;
  @Input() loading = false;

  @Input() displayTitle = true;

  @Output() submitEvent = new EventEmitter<void>();
  @Output() cancelEvent = new EventEmitter<void>();
  @Output() isEditingEvent = new EventEmitter<boolean>(false);

  private IS_EDITING_STATE!: BooleanState;
  private NOT_EDITING_STATE!: BooleanState;

  ngOnInit(): void {
    if (this.cardConfig.editable.state) {
      this.IS_EDITING_STATE = { [this.cardConfig?.selector]: true };
      this.NOT_EDITING_STATE = {
        ...this.editMode?.getValue(),
        [this.cardConfig?.selector]: false,
      };
    }
  }

  toggleEditMode(state: boolean): void {
    if (state) {
      if (this.cardConfig.editable.mode === 'form') {
        this.editMode.next(this.IS_EDITING_STATE);
      }
      this.isEditingEvent.emit(true);
    } else {
      this.editMode.next(this.NOT_EDITING_STATE);
      this.cancelEvent.emit();
      this.isEditingEvent.emit(false);
    }
  }

  onSubmit(): void {
    this.submitEvent.emit();
  }

  onCancel(): void {
    this.toggleEditMode(false);
  }
}

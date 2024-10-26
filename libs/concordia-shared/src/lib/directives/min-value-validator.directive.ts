import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[concordiaNxIonicMinValueValidator]',
  providers: [{ provide: NG_VALIDATORS, useExisting: MinValueDirective, multi: true }],
})
export class MinValueDirective implements Validator {
  @Input('concordiaNxIonicMinValueValidator') minValue: number | null | undefined = null;

  validate(control: AbstractControl): ValidationErrors|null {
    if ((this.minValue || this.minValue === 0) && control.value < this.minValue ) {
      return { minValue: false };
    }

    return null;
  }
}

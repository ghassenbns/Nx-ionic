import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[concordiaNxIonicMaxValueValidator]',
  providers: [{ provide: NG_VALIDATORS, useExisting: MaxValueDirective, multi: true }],
})
export class MaxValueDirective implements Validator {
  @Input('concordiaNxIonicMaxValueValidator') maxValue: number | null | undefined = null;

  validate(control: AbstractControl): ValidationErrors|null {
    if ((this.maxValue || this.maxValue === 0) && control.value >= this.maxValue ) {
      return { maxValue: false };
    }

    return null;
  }
}

import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[concordiaNxIonicWhiteSpaceValidator]',
  providers: [{ provide: NG_VALIDATORS, useExisting: WhiteSpaceValidatorDirective, multi: true }],
})
export class WhiteSpaceValidatorDirective implements Validator {
  @Input('concordiaNxIonicWhiteSpaceValidator') required = false;

  validate(control: AbstractControl): ValidationErrors|null {
    if (this.required && (!control.value && control.value !== 0
      || typeof control.value === 'string' && control.value.trim() === '')) {
      return { whiteSpace: false };
    }

    return null;
  }
}

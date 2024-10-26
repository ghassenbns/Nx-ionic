import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[concordiaNxIonicTypeValidator]',
  providers: [{ provide: NG_VALIDATORS, useExisting: TypeValidatorDirective, multi: true }],
})
export class TypeValidatorDirective implements Validator {
  @Input('concordiaNxIonicTypeValidator') type: 'string' | 'number' = 'string';

  validate(control: AbstractControl): ValidationErrors|null {
    if (this.type === 'number' && control.value && !(/^\d+(\.\d+)?$/.test(control.value))) {
      return { typeNumber: true };
    }

    return null;
  }
}

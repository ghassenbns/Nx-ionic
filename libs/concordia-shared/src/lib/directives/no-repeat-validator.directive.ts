import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[concordiaNxIonicNoRepeatValidator]',
  providers: [{ provide: NG_VALIDATORS, useExisting: NoRepeatValidatorDirective, multi: true }],
})
export class NoRepeatValidatorDirective implements Validator {
  @Input('concordiaNxIonicNoRepeatValidator') items: any[] = [];

  validate(control: AbstractControl): ValidationErrors|null {
    if (control.value && this.items.filter(r => r === control.value)?.length > 1 ) {
      return { notRepeat: false };
    }

    return null;
  }
}

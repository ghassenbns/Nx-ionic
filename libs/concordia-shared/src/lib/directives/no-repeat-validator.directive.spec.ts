import { FormControl } from '@angular/forms';

import { NoRepeatValidatorDirective } from './no-repeat-validator.directive';

describe('NoRepeatValidatorDirective', (): void => {
  it('should create an instance', (): void => {
    const directive: NoRepeatValidatorDirective = new NoRepeatValidatorDirective();
    expect(directive).toBeTruthy();
  });

  it('should be not valid', (): void => {
    const directive: NoRepeatValidatorDirective = new NoRepeatValidatorDirective();
    directive.items = [2, 2];

    const control= new FormControl(2);

    const rez = directive.validate(control);

    expect(rez).toBeTruthy();
  });

  it('should be valid', (): void => {
    const directive: NoRepeatValidatorDirective = new NoRepeatValidatorDirective();
    directive.items = [2, 4];

    const control= new FormControl(8);

    const rez = directive.validate(control);

    expect(rez).toBeFalsy();
  });
});

import { AbstractControl } from '@angular/forms';

import { WhiteSpaceValidatorDirective } from './white-space-validator.directive';

describe('WhiteSpaceValidatorDirective', (): void => {
  it('should create an instance', (): void => {
    const directive: WhiteSpaceValidatorDirective = new WhiteSpaceValidatorDirective();
    expect(directive).toBeTruthy();
  });

  it('should be falsy', (): void => {
    const directive: WhiteSpaceValidatorDirective = new WhiteSpaceValidatorDirective();
    directive.required = true;

    const rez = directive.validate({ value: '  ww' } as AbstractControl);

    expect(rez).toBeFalsy();
  });

  it('should be truthy', (): void => {
    const directive: WhiteSpaceValidatorDirective = new WhiteSpaceValidatorDirective();
    directive.required = true;

    const rez = directive.validate({ value: '  ' } as AbstractControl);

    expect(rez).toBeTruthy();
  });
});

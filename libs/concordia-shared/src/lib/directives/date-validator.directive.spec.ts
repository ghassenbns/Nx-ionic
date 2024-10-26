import { DateValidatorDirective } from './date-validator.directive';

describe('DateValidatorDirective', (): void => {
  it('should create an instance', (): void => {
    const directive: DateValidatorDirective = new DateValidatorDirective();
    expect(directive).toBeTruthy();
  });
});

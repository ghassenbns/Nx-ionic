import { AbstractControl, ValidatorFn } from '@angular/forms';

export function notEmptyValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!control.value || control.value.trim() === '') {
      return { notEmpty: 'errors.notEmptyError' };
    }
    return null;
  };
}

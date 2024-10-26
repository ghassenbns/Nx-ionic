import { Pipe, PipeTransform } from '@angular/core';
import { DecimalSeparator, ThousandSeparator } from '@concordia-nx-ionic/concordia-auth-api';

@Pipe({
  name: 'userNumber',
})
export class UserNumberPipe implements PipeTransform {

  transform(nStr: any, param: [ThousandSeparator, DecimalSeparator]
    | [ThousandSeparator, DecimalSeparator, number]): string {
    if ((!nStr && nStr!==0) || !param[0] || !param[1]) {
      return nStr;
    }

    const thousandSeparator = param[0] === 'none' ? ' ' : (param[0] === 'dot' ? '.' : ',');
    const decimalSeparator = param[1] === 'dot' && param[0] !== 'dot' || (param[1] === 'comma' && param[0] === 'comma')
      ? '.' : ',';

    const str = `${nStr}`;
    const x = str.split('.');
    let x1 = x[0];

    const x2 = x.length > 1 ? decimalSeparator + (param[2] ? x[1].slice(0, 2) : x[1]) : '';

    const rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, `$1${thousandSeparator}$2`);
    }

    return x1 + x2;
  }
}

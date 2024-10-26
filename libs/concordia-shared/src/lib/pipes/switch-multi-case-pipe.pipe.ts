import { Pipe, PipeTransform } from '@angular/core';

// see https://stackoverflow.com/a/62566538/1388109 for reference

@Pipe({
  name: 'switchMultiCase',
})
export class SwitchMultiCasePipePipe implements PipeTransform {
  transform(cases: any[], switchOption: any): any {
    return cases.includes(switchOption) ? switchOption : !switchOption;
  }

}

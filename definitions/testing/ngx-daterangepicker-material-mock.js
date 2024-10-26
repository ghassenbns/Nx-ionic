import { Component, Directive, ModuleWithProviders, NgModule } from '@angular/core';

@Directive({
  selector: 'input[ngxDaterangepickerMd]',
  providers: []
})
export class DaterangepickerDirective {
}

@Component({
  selector: 'ngx-daterangepicker-material',
  template: '',
})
export class DateRangePickerComponent {
  constructor() {}
}

@NgModule({
  declarations: [DateRangePickerComponent, DaterangepickerDirective],
  exports: [DateRangePickerComponent, DaterangepickerDirective],
})
export class NgxDaterangepickerMd {
  constructor() {}

  static forRoot(): ModuleWithProviders<NgxDaterangepickerMd> {
    return {
      ngModule: NgxDaterangepickerMd,
      providers: []
    };
  }
}

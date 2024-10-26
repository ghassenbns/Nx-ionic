import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ConcordiaUiModule } from '@concordia-nx-ionic/concordia-ui';
import { IonicModule } from '@ionic/angular';
import { TranslocoModule } from '@ngneat/transloco';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { MarkdownModule } from 'ngx-markdown';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { ScrollerModule } from 'primeng/scroller';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';

import { components } from './components';
import { directive } from './directives';
import { pipes } from './pipes';
import { services } from './services';

@NgModule({
  exports: [...components, ...pipes, ...directive],
  imports: [
    CommonModule,
    IonicModule.forRoot(),
    TableModule,
    FormsModule,
    MultiSelectModule,
    DropdownModule,
    ButtonModule,
    InputTextModule,
    SkeletonModule,
    ScrollerModule,
    RouterModule,
    TranslocoModule,
    NgxDaterangepickerMd.forRoot(),
    ConcordiaUiModule,
    MarkdownModule.forRoot(),
  ],
  declarations: [...components, ...directive, ...pipes],
  providers: [...services, ...pipes],
})
export class SharedModule {}

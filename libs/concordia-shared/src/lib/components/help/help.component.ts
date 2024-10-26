import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { UiStateService } from '@concordia-nx-ionic/concordia-core';
import { Observable } from 'rxjs';

@Component({
  selector: 'concordia-ng-shared-help',
  templateUrl: './help.component.html',
})
export class HelpComponent implements OnInit, OnChanges {
  @Input() page!: string | null;
  @Input() subPage!: string | null;
  @Input() lang!: string | null;
  @Input() theme!: string | null;
  @Input() data!: string | null;

  error$!: Observable<boolean>;

  constructor(
    private readonly uiStateService: UiStateService,
  ) {
  }

  ngOnInit() : void {
    this.error$ = this.uiStateService.loadHelpError();
  }

  ngOnChanges(): void {
    if((this.page || this.subPage) && this.lang && !this.data) {
      this.uiStateService.loadHelp(this.lang, (this.subPage ? this.subPage :  this.page) || '');
    }
  }

  setTheme(data: string, theme: string | null): string {
    return theme ? data?.replace(/\/#theme/g, `/${theme}`) : '';
  }
}

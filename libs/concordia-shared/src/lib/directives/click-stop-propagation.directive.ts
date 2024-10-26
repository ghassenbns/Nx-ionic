import { Directive, HostListener } from '@angular/core';
import { UiStateService } from '@concordia-nx-ionic/concordia-core';

@Directive({
  selector: '[concordiaNxIonicClickStopPropagation]',
})
export class ClickStopPropagationDirective {
  @HostListener('click', ['$event']) public onClick(event: any): void {
    const href = event.srcElement?.href;

    if(href && href.includes('help') ) {
      const page = href.split('/');
      this.uiStateService.setHelpSubPage(page.at(-1));
    }

    event.stopPropagation();
    event.preventDefault();
  }

  constructor(
    private readonly uiStateService: UiStateService,
  ) {
  }
}

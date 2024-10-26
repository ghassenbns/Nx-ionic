import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'concordia-ng-shared-lang-switcher',
  templateUrl: './lang-switcher.component.html',
  styleUrls: ['./lang-switcher.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LangSwitcherComponent {
  @Input() value!: string;
  @Output() update = new EventEmitter<string>();

  languageList = [
    { abr: 'en', name: 'English' },
    { abr: 'es', name: 'Español' },
  ];

  changeLanguage($event: any): void {
    this.update.emit($event.detail.value);
  }
}

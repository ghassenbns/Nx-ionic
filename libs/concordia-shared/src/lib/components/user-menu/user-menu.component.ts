import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
@Component({
  selector: 'concordia-ng-shared-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserMenuComponent {
  @Input() name = '';
  @Input() darkTheme = false;
  @Input() loading = false;
  @Output() logout = new EventEmitter<void>();
  @Output() toggleTheme = new EventEmitter<boolean>();

  logOut(): void {
    this.logout.emit();
  }

  onToggleTheme(event: any, theme: boolean): void {
    event.stopPropagation();
    this.toggleTheme.emit(!theme);
  }
}

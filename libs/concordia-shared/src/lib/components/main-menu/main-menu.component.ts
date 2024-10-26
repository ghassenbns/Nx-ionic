import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Menu } from '../../interfaces/menu';

@Component({
  selector: 'concordia-ng-shared-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainMenuComponent {
  @Input() menus!: Menu[];
  @Input() activeUrl = '';
}

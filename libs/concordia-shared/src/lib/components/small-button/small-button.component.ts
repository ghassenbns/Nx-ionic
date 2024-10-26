import { Component, Input } from '@angular/core';

@Component({
  selector: 'concordia-ng-shared-small-button',
  templateUrl: './small-button.component.html',
  styleUrls: ['./small-button.component.scss'],
})
export class SmallButtonComponent {
  @Input() id: any;
  @Input() link: string | undefined;
  @Input() content: string | undefined;
  @Input() icon: string | undefined;
  @Input() icon_color: string | undefined;
  @Input() loading = false;
}

import { Component, Input } from '@angular/core';

@Component({
  selector: 'concordia-ng-shared-small-card',
  templateUrl: './small-card.component.html',
  styleUrls: ['./small-card.component.scss'],
})
export class SmallCardComponent {
  @Input() id: any;
  @Input() link: string | undefined;
  @Input() name: string | undefined;
  @Input() label: string | undefined;
  @Input() label_detail: string | undefined;
  @Input() icon: string | undefined;
  @Input() icon_color: string | undefined;
  @Input() loading = false;
}

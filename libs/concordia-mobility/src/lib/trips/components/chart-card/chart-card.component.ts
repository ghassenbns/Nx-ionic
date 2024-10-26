import { Component, Input } from '@angular/core';

@Component({
  selector: 'concordia-nx-ionic-chart-card',
  templateUrl: './chart-card.component.html',
  styleUrls: ['./chart-card.component.scss'],
})
export class ChartCardComponent {
  @Input() loading = false;
  @Input() title = '';
  @Input() data = false;
}

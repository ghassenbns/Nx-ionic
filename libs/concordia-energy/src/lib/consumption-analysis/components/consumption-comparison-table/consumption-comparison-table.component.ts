import { Component, Input } from '@angular/core';
import { ColorsService } from '@concordia-nx-ionic/concordia-api-store';
import { DecimalSeparator, ThousandSeparator } from '@concordia-nx-ionic/concordia-auth-api';
import { MeterConsumptionComparisonInterface } from '@concordia-nx-ionic/concordia-energy-api';

@Component({
  selector: 'concordia-nx-ionic-consumption-comparison-table',
  templateUrl: './consumption-comparison-table.component.html',
  styleUrls: ['./consumption-comparison-table.component.scss'],
})
export class ConsumptionComparisonTableComponent {
  @Input() data!: MeterConsumptionComparisonInterface;
  @Input() decimalSeparator!: DecimalSeparator;
  @Input() thousandSeparator!: ThousandSeparator;
  @Input() getDateTimeFormat!: string;

  constructor(
    private readonly colorsService: ColorsService,
  ) {
  }

  getColor(i: number): string {
    return this.colorsService.getColor(i);
  }
}

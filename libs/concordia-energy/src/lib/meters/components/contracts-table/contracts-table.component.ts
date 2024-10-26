import { Component, Input } from '@angular/core';
import { METER_COUNTRIES, MeterInterface } from '@concordia-nx-ionic/concordia-energy-api';

@Component({
  selector: 'concordia-nx-ionic-contracts-table',
  templateUrl: './contracts-table.component.html',
  styleUrls: ['./contracts-table.component.scss'],
})
export class ContractsTableComponent {
  @Input() meter!: MeterInterface;
  @Input() dataKey = 'meterContractId';
  @Input() dataLabel = 'fromDate';

  METER_COUNTRIES = METER_COUNTRIES;
}

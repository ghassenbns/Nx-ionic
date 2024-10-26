import { components } from './components';
import { MeterCustomInfoCardComponent } from './components/custom-info-card/custom-info-card.component';
import { MeterDetailsCardComponent } from './components/details-card/details-card.component';
import { MeterLatestTariffCardComponent } from './components/latest-tariff-card/latest-tariff-card.component';
import { MeterMapComponent } from './components/meter-map/meter-map.component';
import { MetersTableComponent } from './components/meters-table/meters-table.component';
import { PeruContractsEditModalComponent }
  from './components/peru-contracts-edit-modal/peru-contracts-edit-modal.component';
import { PeruContractsTableComponent } from './components/peru-contracts-table/peru-contracts-table.component';
import { SignalsEditModalComponent } from './components/signals-edit-modal/signals-edit-modal.component';
import { SignalsEditTableComponent } from './components/signals-edit-table/signals-edit-table.component';
import { SpainContractsEditModalComponent }
  from './components/spain-contracts-edit-modal/spain-contracts-edit-modal.component';
import { SpainContractsTableComponent } from './components/spain-contracts-table/spain-contracts-table.component';
import { MetersDetailsComponent } from './meters-details/meters-details.component';
import { MetersListComponent } from './meters-list/meters-list.component';

export const metersComponents = [
  ...components,
  MetersListComponent,
  MeterCustomInfoCardComponent,
  MetersDetailsComponent,
  MetersTableComponent,
  MeterDetailsCardComponent,
  MeterLatestTariffCardComponent,
  MeterMapComponent,
  SpainContractsTableComponent,
  PeruContractsTableComponent,
  SpainContractsEditModalComponent,
  PeruContractsEditModalComponent,
  SignalsEditModalComponent,
  SignalsEditTableComponent,
];

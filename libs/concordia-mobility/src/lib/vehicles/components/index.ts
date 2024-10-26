import { VehiclesDetailsComponent } from '../vehicles-details/vehicles-details.component';
import { VehiclesDetailsCardComponent } from '../vehicles-details/vehicles-details-card/vehicles-details-card.component';
import { VehiclesMapCardComponent } from '../vehicles-details/vehicles-map-card/vehicles-map-card.component';
import { VehiclesListComponent } from '../vehicles-list/vehicles-list.component';
import { ModalEditSignalComponent } from './modal-edit-signal/modal-edit-signal.component';
import { ModalEditVehicleComponent } from './modal-edit-vehicle/modal-edit-vehicle.component';
import { ModalSignalsTableEditComponent } from './modal-signals-table-edit/modal-signals-table-edit.component';
import { ModalVehiclesTableEditComponent } from './modal-vehicles-table-edit/modal-vehicles-table-edit.component';
import { SignalsTableComponent } from './signals-table/signals-table.component';
import { VehiclesTableComponent } from './vehicles-table/vehicles-table.component';

export const components = [
  ModalVehiclesTableEditComponent,
  ModalEditVehicleComponent,
  VehiclesTableComponent,
  VehiclesListComponent,
  VehiclesDetailsComponent,
  VehiclesDetailsCardComponent,
  VehiclesMapCardComponent,
  ModalEditSignalComponent,
  SignalsTableComponent,
  ModalSignalsTableEditComponent,
];

import { SignalInterface } from './signalInterface';
import { VehicleFuelCapacityTypes } from './vehicleFuelCapacityTypes';
import { VehicleFuelTypeDataInterface } from './vehicleFuelTypeInterface';
import { VehicleTypeDataInterface } from './vehicleTypeDataInterface';

export declare interface VehicleInterface {
  _id: string | number;
  name: string;
  description: string;
  registrationNumber: string;

  isActive: boolean;
  isDeletable : boolean;
  isEditable: boolean;

  fleetId: string;
  fleetDetails?: {
    _id: string;
    name: string;
    description : string,
    isActive: boolean;
    isDeletable: boolean;
    isEditable: boolean;
  };

  vehicleTypeId: number;
  vehicleTypeDetails: VehicleTypeDataInterface;
  vehicleFuelTypeId: number;
  vehicleFuelTypeDetails: VehicleFuelTypeDataInterface;

  // TODO : Fix the type of signalsConfig,eventsConfig and nodesUsed once response cleared
  eventsConfig:any[];
  signalsConfig: SignalInterface[];
  nodesUsed: any[],

  fuelTankCapacity?: VehicleFuelCapacityTypes | null,
  gasTankCapacity?: VehicleFuelCapacityTypes | null,
  batteryCapacity?: VehicleFuelCapacityTypes | null,
}

export declare interface DriverDataInterface {
  _id: string;
  name: string;
  description: string;

  isActive: boolean;
  isDeletable: boolean;
  isEditable: boolean;

  fleetDetails?: {
    _id: string;
    name: string;
    isActive: boolean;
    isDeletable: boolean;
    isEditable: boolean;
  };
  userDetails?: {
    name : string;
    userId: number;
    isActive: boolean;
  }
  userId?: string | number;
  ownerId?: string | number;
  fleetId: string;
  defaultVehicleId?: string | number | null;

  defaultVehicleDetails?: {
    isActive: boolean;
    isDeletable: boolean;
    isEditable: boolean;
    name: string;
    vehicleTypeId: string | number;
    registrationNumber: string | number;
    string: string;
    _id: string;
  };
}

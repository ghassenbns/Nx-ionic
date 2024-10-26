import { EventsInterface } from './eventsInterface';
import { PositionsInterface } from './positionsInterface';

export declare interface TripsDataInterface {
  _id: string;
  name: string;
  description: string;
  _endDate: number;

  fleetId?: string;
  fleetIds?: string[];
  fleetDetails?: {
    _id: string;
    name: string;
    isEditable?: boolean;
    isDeletable?: boolean;
    isOwnerEditable?: boolean;
  };

  vehicleId?: string | number | null;
  vehicleIds?: string[];
  vehicleDetails?: {
    _id?: string;
    name?: string;
    registrationNumber?: string;
    description?: string;
    updatedAt?: number | null;
    createdAt?: number | null;
    vehicleTypeId?: number | string;
    vehicleFuelTypeId?: number | string;
    fleetId?: number | string;
    tripIds?: string[];
    isActive?: boolean;
    isTravelling?: boolean;
    isEditable?: boolean;
    isDeletable?: boolean;
    nodesUsed?: string[];
    eventsConfig?: string[];
    signalsConfig?: SignalsInterface[];
    events?: EventsInterface;
    positions?: PositionsInterface;
  };

  driverId?: string | number | null;
  driverIds?: string[];
  driverDetails?: {
    _id?: string;
    name?: string;
    description?: string;
    defaultVehicleId?: string | null;
    userId?: string | null;
    fleetId?: string | null;
    updatedAt?: number | null;
    createdAt?: number | null;
    fleetIds?: string[];
    tripIds?: string[];
    isActive?: boolean;
    isEditable?: boolean;
    isDeletable?: boolean;
    isTravelling?: boolean;

    events?: EventsInterface;
  };

  tripStatusId: number;
  tripStatusDetails: {
    label: string;
    status: string,
    tripStatusId: number
  }

  isDeletable: boolean;
  isEditable: boolean;
  isWaypointsEditable: boolean;

  plannedStartDate: number;
  plannedEndDate: number;
  actualStartDate: number | null;
  actualEndDate: number | null;
  updatedAt?: number | null;
  createdAt?: number | null;

  waypoints: Waypoints;
  startLocation: null | string;
  endLocation: null | string;

  events?: EventsInterface;
}

export declare interface Waypoints {
  type: string,
  features: Feature[],
}

export declare interface Feature {
  id: string;
  properties: any;
  type: string;
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
  state: {
    selected: boolean,
    hovered: boolean,
  }
}

export declare interface SignalsInterface {
  _id: string;
  alias: string;
  compSignalId: string;
  nodeId: string;
  vehicleSignalTypeId: number;
}

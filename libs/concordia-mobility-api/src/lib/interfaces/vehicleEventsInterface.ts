export declare interface VehicleEventsInterface {
  events: VehicleEventsEventsInterface[],
  starts: VehicleEventsStatsInterface,
}

export declare interface VehicleIdleTimeInterface {
  compSignalId: string,
  excessiveIdleLabel: string,
  type: string,
  vehicleSignalTypeId: number,
  starts: VehicleEventsStatsInterface,
}

export declare interface VehicleEventsEventsInterface {
  alias: string
  compSignalId: string
  stats: VehicleEventsStatsInterface,
  type: string
  vehicleSignalTypeId: number
}

export declare interface VehicleEventsStatsInterface {
  avg: number,
  count: number,
  duration: number,
  max: number,
  median: number,
  min: number,
}

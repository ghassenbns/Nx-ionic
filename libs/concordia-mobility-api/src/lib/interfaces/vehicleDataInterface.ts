export declare interface VehicleDataInterface {
  alias: string,
  type: string,
  compSignalId: string,
  vehicleSignalTypeId: number,
  date: number,
  value: number,
  unit: any,
  samples: any[],
  stats: {
    min: number,
    max: number,
  },
}

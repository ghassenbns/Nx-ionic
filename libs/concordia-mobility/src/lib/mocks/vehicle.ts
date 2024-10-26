import { VehicleInterface } from '@concordia-nx-ionic/concordia-mobility-api';

export const MOCK_VEHICLE_DATA: VehicleInterface = {
  _id: 'vehicle123',
  name: 'Vehicle 1',
  description: 'Lorem ipsum dolor sit amet',
  isActive: true,
  registrationNumber: 'ABC123',
  fleetId: 'fleet789',
  vehicleTypeId: 1,
  vehicleTypeDetails: {
    label: 'TEST TYPE LABEL',
    vehicleTypeId: 1,
    type: 'TEST TYPE TYPE',
  },
  vehicleFuelTypeId:1,
  vehicleFuelTypeDetails: {
    label: 'TEST FUEL LABEL',
    vehicleFuelTypeId: 1,
    type : 'TEST FUEL TYPE',
  },
  eventsConfig: [],
  signalsConfig: [
    {
      alias: 'accelerator_pos_d',
      compSignalId: '641d8fd2f47038935f01c20b',
      compSignalName: 'accelerator_pos_d',
      nodeId: '641d8ed935bd6016770a118c',
      nodeName: 'FIDRIVE CAR 001 - USE THIS FOR REAL DATA',
      vehicleSignalTypeId: 16,
      vehicleSignalTypeLabel: 'Battery voltage',
      _id: '65532e163d264b38540e927e',
    },
    {
      alias: 'accelerator_pos_e',
      compSignalId: '641d8fd2f47038935f01c20c',
      compSignalName: 'accelerator_pos_e',
      nodeId: '641d8ed935bd6016770a118c',
      nodeName: 'FIDRIVE CAR 001 - USE THIS FOR REAL DATA',
      vehicleSignalTypeId: 8,
      vehicleSignalTypeLabel: 'Calculated engine eoad',
      _id: '65532e163d264b38540e927f',
    },
  ],
  nodesUsed: [],
  isDeletable: true,
  isEditable: true,
};

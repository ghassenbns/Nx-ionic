import { DriverDataInterface } from '@concordia-nx-ionic/concordia-mobility-api';

export const MOCK_DRIVER_DATA: DriverDataInterface = {
    _id: '123456789',
    name: 'TESTER 1',
    description: 'TEST DESCRIPTION',
    isActive: true,
    isDeletable: false,
    isEditable: true,
    fleetDetails: {
      _id: '987654321',
      name: 'TEST FLEET',
      isActive: true,
      isDeletable: false,
      isEditable: true,
    },
    userId: 'user123',
    ownerId: 'owner456',
    fleetId: 'fleet789',
    defaultVehicleId: 'vehicle123',
    defaultVehicleDetails: {
      isActive: true,
      isDeletable: false,
      isEditable: true,
      name: 'Test Vehicle',
      vehicleTypeId: '2',
      registrationNumber: 'TEST123',
      string: 'Some string',
      _id: 'vehicle789',
    },
  };

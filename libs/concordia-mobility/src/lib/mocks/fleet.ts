import { FleetDataInterface } from '@concordia-nx-ionic/concordia-mobility-api';

export const MOCK_FLEET_DATA: FleetDataInterface = {
    _id: 'fleet123',
    name: 'Fleet TEST',
    description: 'TEST Description',
    isActive: true,
    ownerDetails: {
      userId: 1,
      userLevelId: 1,
      name: 'TESTER 1',
    },
    userId: 'user123',
    ownerId: 'owner456',
    managerIds: [1, 2, 3],
    createdAt: 1625097600000, // Placeholder date in milliseconds
    updatedAt: 1625184000000, // Placeholder date in milliseconds
    deletedAt: 1521356464654, // Placeholder for null value
    isEditable: true,
    isDeletable: false,
    isOwnerEditable: true,
    managersDetails: [
      {
        userId: 1,
        userLevelId: 2,
        name: 'TEST MANAGER 1',
        pivot: {
          fleetId: 'fleet123',
          userId: 1,
        },
        deleted: false,
      },
      {
        userId: 2,
        userLevelId: 2,
        name: 'TEST MANAGER 2',
        pivot: {
          fleetId: 'fleet123',
          userId: 2,
        },
        deleted: false,
      },
    ],
    driverIds: ['driver123', 'driver456'],
    vehicleIds: ['vehicle123', 'vehicle456'],
    tripIds: ['trip6546546', 'trip8520'],
  };

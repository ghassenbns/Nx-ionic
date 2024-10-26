import {
  ManagerInterface,
  UserInterface,
} from '@concordia-nx-ionic/concordia-shared';

export declare interface FleetDataInterface {
  _id: string;
  name: string;
  description: string;
  isActive: boolean;
  ownerDetails: UserInterface;
  userId: string | number;
  ownerId: string | number;
  managerIds?: number[];
  createdAt?: number;
  updatedAt?: number;
  deletedAt?: number;
  isEditable: boolean;
  isDeletable: boolean;
  isOwnerEditable: boolean;
  managersDetails: ManagerInterface[];
  driverIds: string[];
  vehicleIds: string[];
  tripIds: string[];
}

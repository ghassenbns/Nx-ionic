import { UserInterface } from './user';

interface PivotInterface {
  fleetId: string;
  userId: number;
}
export interface ManagerInterface extends UserInterface {
  pivot: PivotInterface;
  deleted?: boolean;
}

export type FleetManager = Omit<ManagerInterface, '_id'> & { userId: number};
import { UserLevelInterface } from './userLevelInterface';

export interface UserInterface {
  userId: number;
  userLevelId: number;
  name: string;
  userLevel?: UserLevelInterface;
}

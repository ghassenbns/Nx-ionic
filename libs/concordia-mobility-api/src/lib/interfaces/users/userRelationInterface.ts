import { UserLevelInterface } from '@concordia-nx-ionic/concordia-shared';

export interface UserRelationInterface {
  name: string;
  userLevelId: string | number;
  userId: string | number;
  userLevel: UserLevelInterface;
  hasDriver?: boolean;
}

export declare interface HierarchiesInterface {
  _id: string;
  name: string;
  isPublic: boolean;
  isEditable?: boolean;
  ownerId?: string;

  owner: {
    userId: number;
    name: string;
    email: string;
    userLevelId: number;
    creatorUserId: number;
  };
  viewers?: [{
    userId: number;
    name: string;
    email: string;
    userLevelId: number;
    creatorUserId: number;
  }];
  viewerIds?: string[];
}

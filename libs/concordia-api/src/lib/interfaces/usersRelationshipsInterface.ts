export declare interface UsersRelationshipsInterface {
  userRelationshipId: number,
  userId: number,
  relationUserId: number,
  relatedUser: RelatedUserInterface,
}

export declare interface RelatedUserInterface {
  userId: number,
  name: string,
  userLevelId: number,
  userLevel: UserLevelInterface,
}

export declare interface UserLevelInterface {
  userLevelId: number,
  name: string,
  // name: 'super_admin'
}

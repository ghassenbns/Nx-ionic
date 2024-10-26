export interface UserProfileInterface {
  first_name: string;
  last_name: string;
  occupation: string;
  email: string;
  website: string;
  address: string;
  phone: string;
  social_twitter: string;
  avatar_url: string;
  banner_url: string;
}

export class UserProfile {
  firstName: string;
  lastName: string;
  occupation: string;
  email: string;
  website: string;
  address: string;
  phone: string;
  socialTwitter: string;
  avatarUrl: string;
  bannerUrl: string;

  public constructor(params: UserProfileInterface) {
    this.firstName = params.first_name;
    this.lastName = params.last_name;
    this.occupation = params.occupation;
    this.email = params.email;
    this.address = params.address;
    this.website = params.website;
    this.phone = params.phone;
    this.socialTwitter = params.social_twitter;
    this.avatarUrl = params.avatar_url;
    this.bannerUrl = params.banner_url;
  }
}

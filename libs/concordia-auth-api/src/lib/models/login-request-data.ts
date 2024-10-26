export interface LoginRequestDataInterface {
  username: string;
  password: string;
}

export class LoginRequestData implements LoginRequestDataInterface {
  public username: string;
  public password: string;

  public constructor(params: LoginRequestDataInterface) {
    this.username = params.username;
    this.password = params.password;
  }
}

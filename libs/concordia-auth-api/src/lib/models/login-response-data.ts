export interface LoginResponseDataInterface {
  token_type: string;
  expires_in: number;
  access_token: string;
  refresh_token: string;
}

export class LoginResponseData {
  public tokenType: string;
  public expiresIn: number;
  public accessToken: string;
  public refreshToken: string;

  public constructor(params: LoginResponseDataInterface) {
    this.tokenType = params.token_type;
    this.expiresIn = params.expires_in;
    this.accessToken = params.access_token;
    this.refreshToken = params.refresh_token;
  }
}

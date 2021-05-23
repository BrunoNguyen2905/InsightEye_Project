export default interface IAccount {
  accessToken: string;
  tokenType: string;
  refreshToken: string;
  expiresIn: number;
  clientId: string;
  userName: string;
  userId: string;
  expire: string;
  issued: string;
  shouldChangePassword: boolean;
  role: Roles;
}

export enum Roles {
  BaseUser = "BaseUser",
  VideoUser = "VideoUser",
  Supervisor = "Supervisor",
  Admin = "Admin"
}

export enum RolesText {
  BaseUser = "Base User",
  VideoUser = "Video User",
  Supervisor = "Supervisor",
  Admin = "Admin"
}

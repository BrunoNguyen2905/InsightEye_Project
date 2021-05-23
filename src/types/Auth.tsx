// import IAccount from "./Account";
import { User } from "oidc-client";
export default interface IAuth {
  isAuth: boolean;
  isChecking: boolean;
  account: User | null;
  accountID: string;
}

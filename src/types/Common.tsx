import INotificationInfo from "../components/notification/types";
import IUser from "./User";

export default interface ICommon {
  notification: INotificationInfo | {};
  users: IUser[];
  libActive: boolean;
  loading: string[];
}

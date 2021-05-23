import Variant from "./variant";

export default interface INotificationInfo {
  isOpen?: boolean;
  variant: Variant;
  message: string;
}

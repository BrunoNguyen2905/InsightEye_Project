import { connect, Dispatch } from "react-redux";
import { IStoreState } from "../../types/index";
import NotiSnackbar, { INotiProps, INotiDispatch } from "./component";
import Variant from "./types/variant";
import INotificationInfo from "./types/index";
import { IUpdateNotification, ceaseNotification } from "./action";

const AUTO_HIDE_DURATION = 3000;

export function mapStateToProps({
  common: { notification }
}: IStoreState): INotiProps {
  let noti = notification as INotificationInfo;
  if (!noti || !noti.variant) {
    noti = {
      isOpen: false,
      variant: Variant.INFO,
      message: ""
    };
    return {
      noti,
      autoHideDuration: 0
    };
  }
  return {
    noti,
    autoHideDuration: noti.variant === Variant.ERROR ? 0 : AUTO_HIDE_DURATION
  };
}

export function mapDispatchToProps(
  dispatch: Dispatch<IUpdateNotification>
): INotiDispatch {
  return {
    handleClose: noti => {
      ceaseNotification(dispatch)(noti);
    }
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)<{}>(NotiSnackbar);

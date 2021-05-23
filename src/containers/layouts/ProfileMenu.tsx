import { connect, Dispatch } from "react-redux";
import * as actions from "../../actions/index";
import { IStoreState } from "../../types/index";
import ProfileMenu from "../../components/layouts/ProfileMenu";
import {
  ISetupAuthentication,
  setupAuthentication,
  logout,
  ILogout
} from "../../scenes/auth/actions/Auth";
import { User } from "oidc-client";

interface IStateToProps {
  isOpen: boolean;
  anchorEl: any;
}

export function mapStateToProps({ profileMenu }: IStoreState): IStateToProps {
  return {
    isOpen: !!profileMenu.anchorEl,
    anchorEl: profileMenu.anchorEl
  };
}

export function mapDispatchToProps(
  dispatch: Dispatch<
    actions.IUpdateProfileMenu | ISetupAuthentication | ILogout
  >
) {
  return {
    handleMenu: (event: any) =>
      dispatch(
        actions.updateProfileMenu({
          anchorEl: event.currentTarget
        })
      ),
    handleClose: () =>
      dispatch(
        actions.updateProfileMenu({
          anchorEl: null
        })
      ),
    handleLogout: () => {
      dispatch(logout());
      dispatch(setupAuthentication());
    }
  };
}
// export default connect<IStateToProps, IDispatchToProps, {
//     children:React.ReactElement<{}> | React.ReactElement<{}>[]
// }, IPersistentDrawerProps>(mapStateToProps, mapDispatchToProps)(Layout);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)<{
  account: User;
}>(ProfileMenu);

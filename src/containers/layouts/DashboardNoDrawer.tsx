import { connect, Dispatch } from "react-redux";
import * as actions from "../../actions/index";
import { IStoreState } from "../../types/index";
import Layout from "../../components/layouts/DashboardNoDrawer";
// import { IPersistentDrawerProps } from '../components/Layout';
import { User } from "oidc-client";

interface IStateToProps {
  isOpenDrawer: boolean;
}

interface IDispatchToProps {
  handleDrawerOpen: () => void;
  handleDrawerClose: () => void;
}

export function mapStateToProps({ isOpenDrawer }: IStoreState): IStateToProps {
  return {
    isOpenDrawer
  };
}

export function mapDispatchToProps(
  dispatch: Dispatch<actions.IHandleDrawer>
): IDispatchToProps {
  return {
    handleDrawerOpen: () => dispatch(actions.handleDrawer(true)),
    handleDrawerClose: () => dispatch(actions.handleDrawer(false))
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
  children: React.ReactElement<{}> | Array<React.ReactElement<{}>>;
}>(Layout);

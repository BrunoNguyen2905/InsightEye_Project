import { connect, Dispatch } from "react-redux";
import * as actions from "../../actions/index";
import { IStoreState } from "../../types/index";
import Layout from "../../components/layouts/Dashboard";
// import { IPersistentDrawerProps } from '../components/Layout';
// import IAccount from "../../types/Account";
import { User } from "oidc-client";
import { ILib } from "../../scenes/lib/types/libs";
import { ISelectLib, selectLib } from "../../scenes/lib/actions/libs";

interface IStateToProps {
  isOpenDrawer: boolean;
  libs: ILib[];
  selectedLib: string;
}

interface IDispatchToProps {
  handleDrawerOpen: () => void;
  handleDrawerClose: () => void;
  changeLib: (id: string) => void;
}

export function mapStateToProps({
  isOpenDrawer,
  libs
}: IStoreState): IStateToProps {
  return {
    libs: libs.list,
    selectedLib: libs.selectedLib,
    isOpenDrawer
  };
}

export function mapDispatchToProps(
  dispatch: Dispatch<actions.IHandleDrawer | ISelectLib>
): IDispatchToProps {
  return {
    changeLib: (id: string) => {
      dispatch(selectLib(id));
    },
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
}>(Layout as any);

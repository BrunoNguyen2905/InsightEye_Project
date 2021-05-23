import { connect, Dispatch } from "react-redux";
import { IStoreState } from "../../types/index";
import Layout from "../../components/layouts";
import IAuth from "../../types/Auth";
import RouteUri from "../../helpers/routeUri";
import { ILib } from "src/scenes/lib/types/libs";
import { setLibActive, ISetLibActive } from "src/actions";
// import { IPersistentDrawerProps } from '../components/Layout';

interface IStateToProps {
  auth: IAuth;
  uri: RouteUri;
  currentLib: ILib | undefined;
  libActive: boolean;
  isLoading: boolean;
}

export function mapStateToProps({
  auth,
  currentUri,
  libs: { selectedLib, list },
  common: { libActive, loading }
}: IStoreState): IStateToProps {
  return {
    currentLib: list.find(l => l.id === selectedLib),
    auth,
    uri: currentUri,
    libActive,
    isLoading: loading.length > 0
  };
}

export function mapDispatchToProps(dispatch: Dispatch<ISetLibActive>): {} {
  return {
    setActive: (status: boolean) => {
      dispatch(setLibActive(status));
    }
  };
}

// export function mapDispatchToProps(
//   dispatch: Dispatch<>
// ): {} {
//   return {};
// }
// export default connect<IStateToProps, IDispatchToProps, {
//     children:React.ReactElement<{}> | React.ReactElement<{}>[]
// }, IPersistentDrawerProps>(mapStateToProps, mapDispatchToProps)(Layout);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)<{
  children: React.ReactElement<{}> | Array<React.ReactElement<{}>>;
}>(Layout);

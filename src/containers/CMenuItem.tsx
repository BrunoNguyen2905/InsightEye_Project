import { connect, Dispatch } from "react-redux";
import { IStoreState } from "../types/index";
import CMenuItem, { IMenuItemProps } from "../components/CMenuItem";
import { routeMatch, navigateToUri } from "../helpers/url";
import RouteUri from "../helpers/routeUri";
import { RouterAction } from "react-router-redux";

export function mapStateToProps(
  { routing }: IStoreState,
  { uri }: IMenuItemProps
) {
  if (!routing || !routing.location) {
    return {};
  }
  return {
    selected: uri ? routeMatch(routing.location, uri) : false
  };
}

export function mapDispatchToProps(dispatch: Dispatch<RouterAction>) {
  return {
    onClick: (uri: RouteUri) => {
      dispatch(navigateToUri(uri));
    }
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)<{
  text: string;
  uri?: RouteUri;
  icon?: React.ReactElement<{}>;
}>(CMenuItem);

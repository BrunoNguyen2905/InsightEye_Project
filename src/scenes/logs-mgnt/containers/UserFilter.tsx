import { connect, Dispatch } from "react-redux";
import { IStoreState } from "src/types";
import IStyleProps from "../../../styles/utils";
import { ISelectItem, SelectFilter } from "../components/SelectFilter";

export function mapStateToProps(
  { common: { users } }: IStoreState,
  props: {
    label: string;
    type: string;
    change: (event: any) => void;
    className?: string;
  } & IStyleProps
) {
  const items: Array<ISelectItem<string>> = users.map(user => ({
    label: user.userName,
    value: user.id
  }));
  return {
    items: [{ value: "-1", label: "All" }, ...items]
  };
}

export function mapDispatchToProps(dispatch: Dispatch) {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectFilter);

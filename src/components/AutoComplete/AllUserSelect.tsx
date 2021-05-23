import { connect, Dispatch } from "react-redux";
import { IStoreState } from "src/types";
import AutoComplete from ".";
import { IAutocompleteSuggestion } from "./index";
import { IUserGetList, IUserUpdateList } from "../../actions/UserList";
import { getAllListUser } from "src/actions/ALLUserList";
import { store } from "../../index";

export function mapStateToProps({ common: { users } }: IStoreState) {
  const suggestions: IAutocompleteSuggestion[] = users.map(user => ({
    label: user.userName,
    value: user.id
  }));
  return {
    suggestions
  };
}

export function mapDispatchToProps(
  dispatch: Dispatch<IUserGetList | IUserUpdateList>
) {
  getAllListUser(store)(dispatch)();
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AutoComplete);

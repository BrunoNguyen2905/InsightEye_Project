import { connect, Dispatch } from "react-redux";
import { IStoreState } from "../../../types";
import UserManagement from "../components/UserManagement";
import {
  addUser,
  banUser,
  deleteUser,
  editUser,
  editUserPassword,
  getListUser,
  IEditUserPasswordPayload,
  IRequestAddUser,
  IRequestEditUser,
  ISetSearchQueryPayload,
  setSearchUserQuery,
  unbanUser
} from "../actions/users";

function mapStateToProps({ usersManagement, libs, auth }: IStoreState) {
  return {
    role: libs.currentRole,
    selectedLib: libs.selectedLib,
    isLoading: usersManagement.searchUserQuery.isLoading,
    isFailed: usersManagement.searchUserQuery.isLoading,
    users: usersManagement.listUser.users,
    total: usersManagement.listUser.total,
    searchKeyword: usersManagement.searchUserQuery.keyword,
    searchRole: usersManagement.searchUserQuery.role,
    paging: {
      limit: usersManagement.searchUserQuery.limit,
      page: usersManagement.searchUserQuery.page
    }
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    resetQuery: () => {
      dispatch(
        setSearchUserQuery({
          isFailed: false,
          isLoading: false,
          keyword: "",
          role: "",
          limit: 10,
          page: 1
        })
      );
    },
    searchUser: () => {
      dispatch(getListUser());
    },
    updateQuery: (query: ISetSearchQueryPayload) => {
      dispatch(setSearchUserQuery(query));
    },
    addUser: (data: IRequestAddUser, cb: (reset: boolean) => void) => {
      dispatch(addUser(data, cb));
    },
    editUser: (
      data: {
        id: string;
        data: IRequestEditUser;
      },
      cb: (reset: boolean) => void
    ) => {
      dispatch(editUser(data, cb));
    },
    editUserPassword: (
      data: IEditUserPasswordPayload,
      cb: (reset: boolean) => void
    ) => {
      dispatch(editUserPassword(data, cb));
    },
    banUser(id: string, cb?: (reset: boolean) => void) {
      dispatch(banUser(id, cb));
    },
    unbanUser(id: string, cb?: (reset: boolean) => void) {
      dispatch(unbanUser(id, cb));
    },
    deleteUser(id: string, cb?: (reset: boolean) => void) {
      dispatch(deleteUser(id, cb));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserManagement);

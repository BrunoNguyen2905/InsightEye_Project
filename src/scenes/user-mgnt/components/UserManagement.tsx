import * as React from "react";
import { IUser } from "../types/users";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { CSSProperties } from "@material-ui/core/styles/withStyles";
import Paper from "@material-ui/core/Paper";
import BackDrop from "@material-ui/core/Backdrop";
import IStyleProps from "../../../styles/utils";
import PaginationMui from "src/components/Pagination";
import SectionLoading from "src/components/SectionLoading";
import Sidebar from "../components/Sidebar";
import ControlBar from "../components/ControlBar";
import FormAddUser from "../components/FormAddUser";
import DetailUser from "../components/DetailUser";
import UsersTable from "./UsersTable";
import {
  IEditUserPasswordPayload,
  IRequestAddUser,
  IRequestEditUser,
  ISetSearchQueryPayload
} from "../actions/users";
import { debounce } from "lodash-es";
import { defaultRules } from "react-hoc-form-validatable";
import { UserLibRole } from "../../../helpers/permission";

interface IProps {
  selectedLib: string;
  isLoading: boolean;
  isFailed: boolean;
  users: IUser[];
  total: number;
  searchKeyword: string;
  searchRole: string;
  paging: {
    limit: number;
    page: number;
  };
  searchUser: () => void;
  resetQuery: () => void;
  updateQuery: (query: ISetSearchQueryPayload) => void;
  addUser: (data: IRequestAddUser, cb: (reset: boolean) => void) => void;
  editUser: (
    data: {
      id: string | null;
      data: IRequestEditUser;
    },
    cb: (reset: boolean) => void
  ) => void;
  editUserPassword: (
    data: IEditUserPasswordPayload,
    cb: (reset: boolean) => void
  ) => void;
  banUser: (id: string, cb?: (reset: boolean) => void) => void;
  unbanUser: (id: string, cb?: (reset: boolean) => void) => void;
  deleteUser: (id: string, cb?: (reset: boolean) => void) => void;
  role: UserLibRole;
}

interface IStates {
  isOpenUserAdd: boolean;
  openUserDetail: string | null;
}

const styles = (theme: Theme): { [k: string]: CSSProperties } =>
  createStyles({
    backdrop: {
      zIndex: 1
    },
    wrap: {
      position: "relative",
      height: "100%",
      paddingTop: theme.spacing.unit,
      paddingBottom: theme.spacing.unit * 2,
      paddingRight: theme.spacing.unit * 2,
      paddingLeft: theme.spacing.unit * 2,
      overflowX: "hidden"
    },
    control: {
      display: "flex",
      paddingRight: theme.spacing.unit * 2,
      paddingLeft: theme.spacing.unit * 2,
      paddingTop: theme.spacing.unit * 2,
      paddingBottom: theme.spacing.unit * 2,
      marginBottom: theme.spacing.unit * 2
    },
    add: {
      marginLeft: "auto"
    },
    paging: {
      paddingTop: theme.spacing.unit * 2,
      paddingBottom: theme.spacing.unit * 2,
      textAlign: "center"
    }
  });

class UserManagement extends React.Component<IStyleProps & IProps, IStates> {
  public state = {
    isOpenUserAdd: false,
    openUserDetail: null
  };

  public componentDidMount() {
    this.props.resetQuery();
    this.props.searchUser();
  }

  public componentDidUpdate(prevProps: IProps) {
    if (prevProps.selectedLib !== this.props.selectedLib) {
      this.setState({
        isOpenUserAdd: false,
        openUserDetail: null
      });
      this.props.resetQuery();
      this.props.searchUser();
    }
  }

  private debounceSearchKeyword = debounce((cb: () => void) => {
    cb();
  }, 250);

  private onChangePagination = (page: number) => {
    this.props.updateQuery({
      page
    });
    this.props.searchUser();
  };

  private onChangeKeyword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    this.props.updateQuery({
      page: 1,
      keyword: target.value
    });
    this.debounceSearchKeyword(() => {
      this.props.searchUser();
    });
  };
  private onChangeRole = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    this.props.updateQuery({
      page: 1,
      role: target.value === "all" ? "" : target.value
    });
    this.debounceSearchKeyword(() => {
      this.props.searchUser();
    });
  };

  private createSubmit = (inputs: any, reset: (should: boolean) => void) => {
    this.props.addUser(
      {
        emailAddress: inputs.emailAddress.value,
        firstName: inputs.firstName.value,
        lastName: inputs.lastName.value,
        roleSystemName: inputs.roleSystemName.value
      },
      reset
    );
  };

  private editSubmit = (inputs: any, reset: (should: boolean) => void) => {
    if (this.state.openUserDetail !== null) {
      const data = {
        id: this.state.openUserDetail,
        data: {
          firstName: inputs.firstName.value,
          lastName: inputs.lastName.value,
          roleSystemName:
            inputs.roleSystemName && inputs.roleSystemName.value
              ? inputs.roleSystemName.value
              : undefined
        }
      };
      this.props.editUser(data, reset);
    }
  };

  private editPassword = (inputs: any, reset: (should: boolean) => void) => {
    if (this.state.openUserDetail !== null) {
      this.props.editUserPassword(
        {
          id: this.state.openUserDetail || "",
          newPassword: inputs.password.value,
          confirmPassword: inputs.confirmPassword.value
        },
        reset
      );
    }
  };

  private toggleAddUser = () => {
    this.setState({
      isOpenUserAdd: !this.state.isOpenUserAdd
    });
  };

  private onClickRowUser = (id: string) => {
    return () => {
      this.setState({
        openUserDetail: id
      });
    };
  };
  private closeDetailUser = () => {
    this.setState({
      openUserDetail: null
    });
  };

  public render() {
    const {
      users,
      classes,
      paging,
      total,
      isLoading,
      searchKeyword,
      searchRole,
      role
    } = this.props;

    return (
      <div className={classes.wrap}>
        {isLoading && <SectionLoading />}
        <ControlBar
          role={role}
          searchRole={searchRole || "all"}
          onChangeRole={this.onChangeRole}
          onChangeKeyword={this.onChangeKeyword}
          searchKeyword={searchKeyword}
          toggleAddUser={this.toggleAddUser}
        />
        {users.length > 0 && (
          <Paper>
            <UsersTable onClickRow={this.onClickRowUser} users={users} />
            <div className={classes.paging}>
              <PaginationMui
                onChangePage={this.onChangePagination}
                disabled={isLoading}
                start={paging.page}
                display={5}
                total={Math.ceil(total / paging.limit)}
              />
            </div>
          </Paper>
        )}
        {(this.state.isOpenUserAdd || Boolean(this.state.openUserDetail)) && (
          <BackDrop
            className={classes.backdrop}
            open={
              this.state.isOpenUserAdd || Boolean(this.state.openUserDetail)
            }
          />
        )}
        <Sidebar isOpen={this.state.isOpenUserAdd}>
          <FormAddUser
            onClickBack={this.toggleAddUser}
            submitCallback={this.createSubmit}
            validateLang="en"
            rules={defaultRules}
          />
        </Sidebar>
        <Sidebar isOpen={Boolean(this.state.openUserDetail)}>
          <DetailUser
            closeDetail={this.closeDetailUser}
            role={role}
            banUser={this.props.banUser}
            unbanUser={this.props.unbanUser}
            deleteUser={this.props.deleteUser}
            user={users.find(user => user.id === this.state.openUserDetail)}
            onClickBack={this.closeDetailUser}
            editCallback={this.editSubmit}
            editPasswordCallback={this.editPassword}
          />
        </Sidebar>
      </div>
    );
  }
}

export default withStyles(styles)(UserManagement);

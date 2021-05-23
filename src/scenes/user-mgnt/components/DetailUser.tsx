import * as React from "react";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { CSSProperties } from "@material-ui/core/styles/withStyles";
import BackIcon from "@material-ui/icons/ArrowBack";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import IStyleProps from "../../../styles/utils";
import { IUser } from "../types/users";
import FormUser from "./FormEditUser";
import FormSetPasswordUser from "./FormSetPasswordUser";
import { defaultRules } from "react-hoc-form-validatable";
import red from "@material-ui/core/colors/red";
import ConfirmDialog from "../../../components/Dialog/Confirm";
import { allow, UserLibRole } from "../../../helpers/permission";

const styles = (theme: Theme): { [k: string]: CSSProperties } =>
  createStyles({
    wrap: {
      padding: theme.spacing.unit * 2
    },
    info: {
      padding: theme.spacing.unit * 2
    },
    title: {
      padding: theme.spacing.unit * 2,
      display: "flex",
      alignItems: "center"
    },
    submit: {
      marginTop: theme.spacing.unit * 2,
      textAlign: "center",
      display: "block",
      marginLeft: "auto",
      marginRight: "auto"
    },
    tabs: {
      marginTop: theme.spacing.unit * 2,
      backgroundColor: "#0096DA",
      color: theme.palette.common.white
    },
    action: {
      padding: "8px 16px 16px",
      display: "flex",
      justifyContent: "center",
      "& button:first-child": {
        marginRight: theme.spacing.unit
      }
    },
    danger: {
      color: theme.palette.getContrastText(red[400]),
      backgroundColor: red[400],
      "&:hover": {
        backgroundColor: red[600]
      }
    }
  });
interface IProps {
  role: UserLibRole;
  user: IUser | undefined;
  onClickBack: () => void;
  editCallback: (inputs: any, reset: (should: boolean) => void) => void;
  editPasswordCallback: (inputs: any, reset: (should: boolean) => void) => void;
  banUser: (id: string, cb?: (reset: boolean) => void) => void;
  unbanUser: (id: string, cb?: (reset: boolean) => void) => void;
  deleteUser: (id: string, cb?: (reset: boolean) => void) => void;
  closeDetail: () => void;
}

interface IStates {
  openTab: number;
  isOpenDelete: boolean;
  isOpenBan: boolean;
  isOpenUnban: boolean;
  isDoingAction: boolean;
}

class FormAddUser extends React.Component<IStyleProps & IProps, IStates> {
  public state = {
    isDoingAction: false,
    openTab: 0,
    isOpenDelete: false,
    isOpenUnban: false,
    isOpenBan: false
  };

  private handleChangeTab = (event: React.ChangeEvent<{}>, tab: number) => {
    this.setState({
      openTab: tab
    });
  };

  private openDialog = (st: "ban" | "del" | "unban") => {
    return () => {
      switch (st) {
        case "ban": {
          this.setState({
            isOpenBan: true
          });
          break;
        }
        case "del": {
          this.setState({
            isOpenDelete: true
          });
          break;
        }
        case "unban": {
          this.setState({
            isOpenUnban: true
          });
          break;
        }
      }
    };
  };

  private closeConfirmBanDelete = (r: boolean) => {
    if (r && this.props.user) {
      this.setState({
        isDoingAction: true
      });

      if (this.state.isOpenBan) {
        this.props.banUser(this.props.user.id, done => {
          this.setState({
            isOpenBan: !done,
            isDoingAction: false
          });
        });
      }

      if (this.state.isOpenDelete) {
        this.props.deleteUser(this.props.user.id, done => {
          this.setState({
            isOpenDelete: !done,
            isDoingAction: false
          });
          if (done) {
            this.props.closeDetail();
          }
        });
      }

      if (this.state.isOpenUnban) {
        this.props.unbanUser(this.props.user.id, done => {
          this.setState({
            isOpenUnban: !done,
            isDoingAction: false
          });
        });
      }
    } else {
      this.setState({
        isOpenUnban: false,
        isOpenDelete: false,
        isOpenBan: false,
        isDoingAction: false
      });
    }
  };

  public render() {
    const {
      classes,
      user,
      editCallback,
      onClickBack,
      editPasswordCallback,
      role
    } = this.props;
    return user ? (
      <div>
        <div className={classes.title}>
          <IconButton onClick={onClickBack}>
            <BackIcon />
          </IconButton>
          <Typography variant="h6">User: {user.firstName}</Typography>
        </div>
        <Divider />
        <div className={classes.info}>
          <Typography>
            <b>Email</b>: {user.email}
          </Typography>
        </div>
        {allow("ban", role, user.roleName) && (
          <div className={classes.action}>
            {user.isBan ? (
              <Button
                disabled={this.state.isDoingAction}
                onClick={this.openDialog("unban")}
                variant="contained"
                color="secondary"
                className={classes.danger}
              >
                Unban
              </Button>
            ) : (
              <Button
                disabled={this.state.isDoingAction}
                onClick={this.openDialog("ban")}
                variant="contained"
                color="secondary"
                className={classes.danger}
              >
                Ban
              </Button>
            )}
            <Button
              disabled={this.state.isDoingAction}
              onClick={this.openDialog("del")}
              variant="contained"
              color="secondary"
              className={classes.danger}
            >
              Delete
            </Button>
          </div>
        )}

        <ConfirmDialog
          disabled={this.state.isDoingAction}
          title="Confirm Delete"
          isOpen={this.state.isOpenDelete}
          content={<span>Are you sure want to delete the user?</span>}
          onClose={this.closeConfirmBanDelete}
          confirmText="Delete"
        />
        <ConfirmDialog
          disabled={this.state.isDoingAction}
          title="Confirm Ban"
          isOpen={this.state.isOpenBan}
          content={<span>Are you sure want to ban the user?</span>}
          onClose={this.closeConfirmBanDelete}
          confirmText="Ban"
        />
        <ConfirmDialog
          disabled={this.state.isDoingAction}
          title="Confirm Unban"
          isOpen={this.state.isOpenUnban}
          content={<span>Are you sure want to unban the user?</span>}
          onClose={this.closeConfirmBanDelete}
          confirmText="Unban"
        />
        <Divider />
        <Tabs
          className={classes.tabs}
          fullWidth={true}
          value={this.state.openTab}
          onChange={this.handleChangeTab}
        >
          <Tab label="Edit info" />
          <Tab label="Set password" />
        </Tabs>
        {this.state.openTab === 0 && (
          <div className={classes.wrap}>
            <FormUser
              isOwner={user.roleName === UserLibRole.Owner}
              validateLang="en"
              rules={defaultRules}
              submitCallback={editCallback}
              user={user}
            />
          </div>
        )}
        {this.state.openTab === 1 && (
          <div className={classes.wrap}>
            <FormSetPasswordUser
              validateLang="en"
              rules={defaultRules}
              submitCallback={editPasswordCallback}
            />
          </div>
        )}
      </div>
    ) : (
      ""
    );
  }
}
export default withStyles(styles)(FormAddUser);

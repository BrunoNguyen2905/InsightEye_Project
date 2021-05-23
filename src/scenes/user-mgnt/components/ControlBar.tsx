import * as React from "react";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { CSSProperties } from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";
import SearchIcon from "@material-ui/icons/Search";
import Paper from "@material-ui/core/Paper";
import MenuItem from "@material-ui/core/MenuItem";
import IStyleProps from "../../../styles/utils";
import {
  allow,
  UserLibRole,
  UserLibRoleText
} from "../../../helpers/permission";

const styles = (theme: Theme): { [k: string]: CSSProperties } =>
  createStyles({
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
    role: {
      display: "flex",
      alignItems: "center",
      marginLeft: theme.spacing.unit * 2
    }
  });

interface IProps {
  onChangeKeyword: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeRole: (e: React.ChangeEvent<HTMLInputElement>) => void;
  searchKeyword: string;
  searchRole: string;
  toggleAddUser: () => void;
  role: UserLibRole;
}

class ControlBar extends React.Component<IStyleProps & IProps> {
  public render() {
    const {
      searchKeyword,
      classes,
      onChangeKeyword,
      toggleAddUser,
      onChangeRole,
      searchRole,
      role
    } = this.props;
    return (
      <Paper className={classes.control}>
        <TextField
          onChange={onChangeKeyword}
          value={searchKeyword}
          placeholder="Search user"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            )
          }}
        />
        <div className={classes.role}>
          <TextField select={true} value={searchRole} onChange={onChangeRole}>
            <MenuItem value="all">All</MenuItem>
            <MenuItem value={UserLibRole.VideoUser}>
              {UserLibRoleText.VideoUser}
            </MenuItem>
            <MenuItem value={UserLibRole.Supervisor}>
              {UserLibRoleText.Supervisor}
            </MenuItem>
            <MenuItem value={UserLibRole.Admin}>
              {UserLibRoleText.Admin}
            </MenuItem>
            <MenuItem value={UserLibRole.BaseUser}>
              {UserLibRoleText.BaseUser}
            </MenuItem>
          </TextField>
        </div>
        {allow("addUser", role) && (
          <Button
            onClick={toggleAddUser}
            color="primary"
            variant="contained"
            className={classes.add}
          >
            Add user
          </Button>
        )}
      </Paper>
    );
  }
}

export default withStyles(styles)(ControlBar);

import * as React from "react";
import { Theme } from "@material-ui/core/styles";
import withStyles, { CSSProperties } from "@material-ui/core/styles/withStyles";
import IStyleProps from "../../../styles/utils";
import SectionLoading from "src/components/SectionLoading";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Button from "@material-ui/core/Button";
import { ILib } from "../types/libs";
import { Component } from "react";
import { Redirect, RouteComponentProps, withRouter } from "react-router";
import paths from "../../../paths";

const styles = (theme: Theme): { [k: string]: CSSProperties } => ({
  container: {
    padding: theme.spacing.unit * 2,
    maxWidth: 500,
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: theme.spacing.unit * 3
  },
  list: {
    maxHeight: 400,
    overflow: "auto",
    marginTop: theme.spacing.unit * 2
  },
  listItem: {
    marginTop: theme.spacing.unit / 2,
    border: `1px solid ${theme.palette.divider}`
  },
  logout: {
    marginTop: theme.spacing.unit * 2,
    textAlign: "center"
  },
  caption: {
    display: "inline"
  },
  createLib: {
    color: theme.palette.common.white,
    marginBottom: theme.spacing.unit * 2
  },
  createPlan: {
    color: theme.palette.common.white,
    marginBottom: theme.spacing.unit * 2
  }
});

export interface IProps extends RouteComponentProps<{}> {
  libs: ILib[];
  isLoading: boolean;
  onSelectLib: (id: string) => () => void;
  logout: () => void;
  getListLibs: () => void;
  selectLib: string;
}

class StepSelectLib extends Component<IStyleProps & IProps> {
  // private createLib = () => {
  //   this.props.history.push(paths.libNew);
  // };

  public componentDidMount() {
    this.props.getListLibs();
  }

  public render() {
    const {
      libs,
      isLoading,
      onSelectLib,
      classes,
      logout,
      selectLib
    } = this.props;

    if (selectLib && libs.find(l => l.id === selectLib)) {
      return <Redirect to={paths.board} />;
    }

    return (
      <div>
        <Paper className={classes.container}>
          {isLoading && <SectionLoading />}
          {!isLoading && libs.length === 0 && (
            <div>
              <div>
                <Typography variant="h6" gutterBottom={true}>
                  Library is empty
                </Typography>
                <Typography gutterBottom={true}>
                  You don't have any library. Please create a new library to
                  start
                </Typography>
                <Typography gutterBottom={true}>
                  If you are an existing user, you may not have access to any
                  libraries at the moment. You can either create your own
                  library, or log out.
                </Typography>
                <div className={classes.logout}>
                  <Button
                    className={classes.createPlan}
                    fullWidth={true}
                    href="http://shop.ins8.us/Eyeview/Plan"
                    variant="contained"
                    color="secondary"
                  >
                    Create Plan
                  </Button>

                  <Button
                    fullWidth={true}
                    onClick={logout}
                    variant="contained"
                    color="primary"
                  >
                    Logout and use another account
                  </Button>
                </div>
              </div>
            </div>
          )}
          {!isLoading && libs.length > 0 && (
            <>
              <Typography>
                You currently have access to the following libraries.
              </Typography>
              <Typography>
                Please select which one to join, or log out and use another
                account.
              </Typography>
              <List className={classes.list}>
                {libs.map(lib => (
                  <ListItem
                    className={classes.listItem}
                    button={true}
                    onClick={onSelectLib(lib.id)}
                    key={lib.id}
                  >
                    <ListItemText primary={lib.name} />
                  </ListItem>
                ))}
              </List>
              <div className={classes.logout}>
                <Button onClick={logout} variant="contained" color="primary">
                  Logout and use another account
                </Button>
              </div>
            </>
          )}
        </Paper>
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(StepSelectLib));

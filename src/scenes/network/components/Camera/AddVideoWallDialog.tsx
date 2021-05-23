import * as React from "react";
import { withStyles, Theme } from "@material-ui/core/styles";
import { CSSProperties } from "@material-ui/core/styles/withStyles";
// import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Check from "@material-ui/icons/Check";
import DialogActions from "@material-ui/core/DialogActions";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import CreateIcon from "@material-ui/icons/Create";
import * as Scrollbars from "react-custom-scrollbars";
import ListItemText from "@material-ui/core/ListItemText";
import LinearProgress from "@material-ui/core/LinearProgress";
import Typography from "@material-ui/core/Typography";
import IStyleProps from "src/styles/utils";
import { IVideoWall } from "../../../video-wall/types/VideoWall";
import { ICameraLayout } from "../../../video-wall/types/Layout";

const styles = (theme: Theme): { [k: string]: CSSProperties } => ({
  textHeader: {
    textAlign: "center"
  },
  container: {
    overflow: "hidden !important",
    height: "550px"
  },
  root: {
    height: "5px"
  },
  titleField: {
    paddingLeft: "35px"
  },
  textField: {
    display: "flex"
  },
  wrapper: {
    display: "flex"
  },
  listWall: {
    marginTop: "20px",
    position: "relative",
    width: "50%",
    paddingRight: "30px",
    left: 0,
    top: 0,
    display: "inline-block",
    marginRight: "20px",
    borderRight: "2px solid black"
  },
  addToNewWall: {
    marginTop: "20px",
    position: "relative",
    width: "50%",
    right: 0,
    top: 0,
    display: "inline-block"
  },
  listItem: {
    paddingRight: "5px"
  },
  button: {
    display: "flex",
    margin: "auto",
    marginTop: "20px"
  },
  scrollListWall: {
    height: "400px"
  }
});
export interface IState {
  isLoading: boolean;
  videoWall: IVideoWall | null;
  wallName: string;
  wallType: number;
}
export interface IProps {
  listCameraId: string[];
  listVideoWall: IVideoWall[];
  listLayout: ICameraLayout[];
  showDialog: boolean;
  handleClose: () => void;
  handleClearListVideo: () => void;
  handleSave: (videoWall: IVideoWall) => void;
  handleCreate: (videoWall: IVideoWall) => void;
  handleSelect: (videoWall: IVideoWall, listCameraId: string[]) => void;
}

class AddVideoWallDialog extends React.Component<IStyleProps & IProps, IState> {
  public state: IState = {
    isLoading: false,
    videoWall: null,
    wallName: "",
    wallType: 1
  };

  constructor(props: IStyleProps & IProps) {
    super(props);
  }

  public componentDidMount() {
    console.log("xx");
  }

  public componentDidUpdate() {
    const { showDialog, handleClearListVideo } = this.props;

    if (this.state && this.state.isLoading && !showDialog) {
      this.setState({
        videoWall: null,
        isLoading: false
      });
      handleClearListVideo();
    }
  }

  public setValueVideoWall = (selectVideoWall: IVideoWall) => {
    const { handleSelect, listCameraId } = this.props;
    this.setState({
      videoWall: selectVideoWall
    });
    if (selectVideoWall) {
      handleSelect(selectVideoWall, listCameraId);
      setTimeout(() => {
        this.onSave();
      }, 100);
    }
  };

  public onClose = () => {
    const { handleClose } = this.props;
    handleClose();
    this.setState({
      videoWall: null,
      isLoading: false
    });
  };

  public onSave = () => {
    const { handleSave } = this.props;
    if (this.state.videoWall) {
      handleSave(this.state.videoWall);
      this.setState({
        isLoading: true
      });
    }
  };

  public onCreate = () => {
    const { handleCreate } = this.props;
    if (this.state.videoWall) {
      handleCreate(this.state.videoWall);
      this.setState({
        isLoading: true
      });
    }
  };

  public createWall = () => {
    const { handleSelect, listCameraId } = this.props;
    const selectVideoWall: IVideoWall = {
      isCustomLayout: this.state.wallType === -1,
      wallName: this.state.wallName,
      wallTiles: [],
      wallType: this.state.wallType
    };
    if (selectVideoWall.isCustomLayout) {
      selectVideoWall.wallLayout = [];
      listCameraId.forEach((cameraId, index) => {
        const x = Math.floor(Math.random() * 70) / 100;
        const y = Math.floor(Math.random() * 70) / 100;
        if (selectVideoWall.wallLayout) {
          selectVideoWall.wallLayout.push({
            x,
            y,
            w: 0.3,
            h: 0.3,
            id: index
          });
        }
      });
    }
    this.setState({
      videoWall: selectVideoWall
    });
    if (selectVideoWall) {
      handleSelect(selectVideoWall, listCameraId);
      setTimeout(() => {
        this.onCreate();
      }, 100);
    }
  };
  public setValueLayout = (event: any) => {
    this.setState({
      wallType: event.target.value
    });
  };

  public handleChangeName = (event: any) => {
    this.setState({
      wallName: event.target.value
    });
  };
  public render() {
    const { showDialog, listVideoWall, classes, listLayout } = this.props;

    return (
      <Dialog
        onClose={this.onClose}
        fullWidth={true}
        open={showDialog}
        maxWidth="md"
        classes={{
          paper: classes.container
        }}
      >
        <div className={classes.root}>
          {this.state.isLoading && <LinearProgress variant="query" />}
        </div>
        {/* <DialogTitle className={classes.textHeader}>
          Choose one video wall from the list
        </DialogTitle> */}
        <DialogContent>
          <div className={classes.wrapper}>
            <div className={classes.listWall}>
              <Typography
                variant="h6"
                gutterBottom={true}
                className={classes.titleField}
              >
                Choose one video wall from the list
              </Typography>
              <Scrollbars.default style={{ height: 400 }}>
                <List component="nav">
                  {listVideoWall.map(option => {
                    const wallType = option.isCustomLayout
                      ? "custom layout"
                      : option.wallType > 1
                      ? `${option.wallType} cameras`
                      : `1 camera`;
                    return (
                      <ListItem
                        key={option.wallId}
                        className={classes.listItem}
                        button={true}
                        onClick={this.setValueVideoWall.bind(this, option)}
                      >
                        {this.state.videoWall &&
                          this.state.videoWall.wallId === option.wallId && (
                            <ListItemIcon>
                              <Check />
                            </ListItemIcon>
                          )}
                        <ListItemText
                          inset={true}
                          primary={`wall ${option.wallName} - ${wallType}`}
                        />
                      </ListItem>
                    );
                  })}
                </List>
              </Scrollbars.default>
            </div>
            <div className={classes.addToNewWall}>
              <Typography
                variant="h6"
                gutterBottom={true}
                className={classes.titleField}
              >
                Add to new video wall
              </Typography>
              <TextField
                label="Name"
                className={classes.textField}
                value={this.state.wallName}
                onChange={this.handleChangeName}
                margin="normal"
              />
              <TextField
                select={true}
                label="Layout"
                className={classes.textField}
                value={this.state.wallType}
                onChange={this.setValueLayout}
                margin="normal"
              >
                {listLayout.map(option => (
                  <MenuItem key={option.quantity} value={option.quantity}>
                    {option.quantity}{" "}
                    {option.quantity === 1 ? "Camera" : "Cameras"}
                  </MenuItem>
                ))}
                <MenuItem key={-1} value={-1}>
                  Custom Layout
                </MenuItem>
              </TextField>
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                disabled={this.state.wallName === ""}
                onClick={this.createWall}
              >
                <CreateIcon className={classes.leftIcon} />
                Create
              </Button>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.onClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles)(AddVideoWallDialog);

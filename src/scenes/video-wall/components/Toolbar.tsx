import * as React from "react";

import * as classNames from "classnames";
import { withStyles, Theme } from "@material-ui/core/styles";
import { CSSProperties } from "@material-ui/core/styles/withStyles";
import IStyleProps from "src/styles/utils";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import FullscreenIcon from "@material-ui/icons/Fullscreen";
// import EditIcon from "@material-ui/icons/Edit";s
import CancelIcon from "@material-ui/icons/Cancel";
import SaveIcon from "@material-ui/icons/Save";
import { ICCTV, IVideoWall, IWallTileUpdate } from "../types/VideoWall";
import Button from "@material-ui/core/Button";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";
import Typography from "@material-ui/core/Typography";
import red from "@material-ui/core/colors/red";
import blue from "@material-ui/core/colors/blue";
import { ICameraLayout, ICustomTile } from "../types/Layout";

const styles = (theme: Theme): { [k: string]: CSSProperties } => ({
  container: {
    height: "95px",
    // padding: '12px 22px',
    paddingLeft: "10px",
    background: "#F0F0F0",
    position: "relative",
    left: 0,
    right: 0
  },
  textField: {
    width: "250px"
  },
  button: {
    marginLeft: "10px"
  },
  editWrapper: {
    display: "flex"
  },
  viewWrapper: {
    display: "flex"
  },
  groupEdit: {
    position: "absolute",
    right: "10px",
    top: "27px"
  },
  groupView: {
    position: "absolute",
    right: "10px",
    top: "27px"
  },
  leftIcon: {
    marginRight: theme.spacing.unit
  },
  margin: {
    marginLeft: theme.spacing.unit
  },
  cssRed: {
    color: theme.palette.getContrastText(red[500]),
    backgroundColor: red[500],
    "&:hover": {
      backgroundColor: red[700]
    }
  },
  cssBlue: {
    color: theme.palette.getContrastText(blue[500]),
    backgroundColor: blue[500],
    "&:hover": {
      backgroundColor: blue[700]
    }
  }
});

export interface IProps {
  listCTTV: ICCTV[];
  listLayout: ICameraLayout[];
  listVideoWall: IVideoWall[];
  videoWall: IVideoWall;
  status: string;
  loadListVideoWall: () => void;
  loadListCamera: () => void;
  loadListCTTV: (videoWallId: string) => void;
  setVideoWall: (videoWall: IVideoWall) => void;
  setStatus: (status: string) => void;
  openLayout: () => void;
  save: (videoWall: IVideoWall) => void;
  revert: (videoWall: IVideoWall) => void;
  edit: () => void;
  addTile: (tile: ICustomTile) => void;
  deleteVideoWall: (videoWall: IVideoWall) => void;
  selectLayout: (layout: ICameraLayout) => void;
  selectFullScreen: () => void;
  updateWallTile: (wallTiles: IWallTileUpdate[]) => void;
  cleanAll: () => void;
}

class Toolbar extends React.Component<IStyleProps & IProps, any> {
  public state: {
    videoWall: IVideoWall;
    openConfirm: any;
  };

  constructor(props: IStyleProps & IProps) {
    super(props);
    // const { loadListCamera } = this.props;
    // loadListCamera();
  }

  public componentDidUpdate(prevProps: IProps) {
    const {
      videoWall: prevVideoWall,
      listVideoWall: prevListVideoWall
    } = prevProps;
    const { videoWall, updateWallTile, listVideoWall } = this.props;
    if (
      (prevVideoWall &&
        videoWall &&
        (videoWall.wallId !== prevVideoWall.wallId ||
          prevListVideoWall.length !== listVideoWall.length ||
          this.state === null)) ||
      (!prevVideoWall && videoWall)
    ) {
      if (videoWall && videoWall.wallId) {
        const selectVideoWall = listVideoWall.find(
          e => e.wallId === videoWall.wallId
        );
        if (selectVideoWall) {
          // loadListCTTV(videoWall.wallId);
          updateWallTile(selectVideoWall.wallTiles);
          this.setState({
            videoWall: {
              ...selectVideoWall,
              wallType: selectVideoWall.wallType ? selectVideoWall.wallType : 1
            }
          });
        }
      } else {
        updateWallTile([]);
        this.setState({
          videoWall: {
            ...videoWall,
            wallId: ""
          }
        });
      }
    } else if (prevVideoWall && !videoWall) {
      this.setState({
        videoWall: null
      });
    }
  }

  public handleChangeName = (event: any) => {
    const { setStatus } = this.props;
    setStatus("edit");
    this.setState({
      videoWall: {
        ...this.state.videoWall,
        wallName: event.target.value
      }
    });
  };

  public setValueLayout = (event: any) => {
    const { listLayout, selectLayout, setStatus } = this.props;
    setStatus("edit");
    const selectLayoutItem = listLayout.find(e => {
      return e.quantity === event.target.value;
    });
    if (selectLayoutItem) {
      this.setState({
        videoWall: {
          ...this.state.videoWall,
          wallType: selectLayoutItem.quantity
        }
      });
      selectLayout(selectLayoutItem);
    }
  };

  public setValueVideoWall = (event: any) => {
    const { setVideoWall, listVideoWall, setStatus } = this.props;
    setStatus("view");
    const selectVideoWall = listVideoWall.find(e => {
      return e.wallId === event.target.value;
    });
    if (selectVideoWall) {
      setVideoWall(selectVideoWall);
    }
  };

  public revertEdit = () => {
    const {
      videoWall,
      revert,
      listLayout,
      selectLayout,
      listVideoWall
    } = this.props;
    if (listVideoWall.length > 0) {
      const revertVideo = videoWall.wallId ? videoWall : listVideoWall[0];
      const wallType = revertVideo.wallType ? revertVideo.wallType : 1;
      const wallId = revertVideo.wallId ? revertVideo.wallId : "";
      this.setState({
        videoWall: {
          ...revertVideo,
          wallId,
          wallType
        }
      });
      revert(revertVideo);
      const selectLayoutItem = listLayout.find(e => {
        return e.quantity === wallType;
      });
      if (selectLayoutItem) {
        selectLayout(selectLayoutItem);
      }
    } else {
      this.setState({
        videoWall: null
      });
      this.props.cleanAll();
    }
  };

  public handleCloseDialog = () => {
    this.setState({ openConfirm: null });
  };

  public handleClickDialog = (event: any) => {
    this.setState({ openConfirm: event.currentTarget });
  };

  public handleOkDialog = () => {
    const { deleteVideoWall } = this.props;
    deleteVideoWall(this.state.videoWall);
    this.setState({ openConfirm: null });
  };

  public handleCancelDialog = () => {
    this.setState({ openConfirm: null });
  };

  public handleAddTile = () => {
    const { addTile, setStatus } = this.props;
    setStatus("edit");
    const tile: ICustomTile = {
      x: 0,
      y: 0,
      w: 0.2,
      h: 0.2,
      id: -1
    };
    addTile(tile);
  };

  public render() {
    const {
      listVideoWall,
      listLayout,
      openLayout,
      status,
      save,
      selectFullScreen,
      classes
    } = this.props;
    return (
      <div className={classes.container}>
        <div className={classes.viewWrapper}>
          {this.state && this.state.videoWall && this.state.videoWall.wallId && (
            <div>
              <TextField
                select={true}
                label="Video Wall"
                className={classes.textField}
                value={this.state.videoWall.wallId}
                onChange={this.setValueVideoWall}
                margin="normal"
              >
                {listVideoWall.map(option => (
                  <MenuItem key={option.wallId} value={option.wallId}>
                    {option.wallName}
                  </MenuItem>
                ))}
              </TextField>
              {/* <TextField
                  label="Name"
                  className={classes.textField}
                  value={this.state.videoWall.wallName}
                  onChange={this.handleChangeName}
                  margin="normal"
                /> */}
              {this.state.videoWall.wallId &&
                !this.state.videoWall.isCustomLayout && (
                  <TextField
                    select={true}
                    label="Layout"
                    className={classes.textField}
                    value={this.state.videoWall.wallType}
                    onChange={this.setValueLayout}
                    margin="normal"
                  >
                    {listLayout.map(option => (
                      <MenuItem key={option.quantity} value={option.quantity}>
                        {option.quantity}{" "}
                        {option.quantity === 1 ? "Camera" : "Cameras"}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              {this.state.videoWall.isCustomLayout && (
                <Button
                  variant="contained"
                  onClick={this.handleAddTile}
                  color="secondary"
                  className={classNames(classes.margin, classes.cssBlue)}
                >
                  <AddIcon className={classes.leftIcon} />
                  Add Tile
                </Button>
              )}
            </div>
          )}
        </div>
        {status === "edit" &&
          this.state &&
          this.state.videoWall &&
          !this.state.videoWall.wallId && (
            <div className={classes.viewWrapper}>
              <TextField
                label="Name"
                className={classes.textField}
                value={this.state.videoWall.wallName}
                onChange={this.handleChangeName}
                margin="normal"
              />
            </div>
          )}
        {status === "view" && listVideoWall.length === 0 && (
          <div className={classes.groupView}>
            <Button
              variant="contained"
              onClick={openLayout}
              color="secondary"
              className={classNames(classes.margin, classes.cssBlue)}
            >
              <AddIcon />
            </Button>
          </div>
        )}
        {status === "view" &&
          this.state &&
          this.state.videoWall &&
          (this.state.videoWall.wallType > 0 ||
            this.state.videoWall.isCustomLayout) && (
            <div className={classes.groupView}>
              <Button
                variant="contained"
                onClick={openLayout}
                color="secondary"
                className={classNames(classes.margin, classes.cssBlue)}
              >
                <AddIcon />
              </Button>
              <Button
                variant="contained"
                color="primary"
                className={classNames(classes.margin, classes.cssRed)}
                onClick={this.handleClickDialog}
              >
                <DeleteIcon />
              </Button>
              <Dialog
                onClose={this.handleCloseDialog}
                open={Boolean(this.state.openConfirm)}
                fullWidth={true}
              >
                <DialogTitle>Delete Confirm</DialogTitle>
                <DialogContent>
                  <Typography variant="body1" gutterBottom={true}>
                    Are you sure you want to delete this video wall?
                  </Typography>
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.handleCancelDialog} color="primary">
                    Cancel
                  </Button>
                  <Button onClick={this.handleOkDialog} color="primary">
                    Ok
                  </Button>
                </DialogActions>
              </Dialog>
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={selectFullScreen}
              >
                <FullscreenIcon />
              </Button>
            </div>
          )}
        {status === "edit" && this.state && this.state.videoWall && (
          <div className={classes.groupEdit}>
            <Button
              variant="contained"
              color="default"
              className={classes.button}
              onClick={this.revertEdit}
            >
              <CancelIcon className={classes.leftIcon} />
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              disabled={this.state.videoWall.wallName === ""}
              onClick={save.bind(null, this.state.videoWall)}
            >
              <SaveIcon className={classes.leftIcon} />
              Save
            </Button>
          </div>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(Toolbar);

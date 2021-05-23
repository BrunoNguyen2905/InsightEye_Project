import * as React from "react";

import "./style.css";
import { withStyles, Theme } from "@material-ui/core/styles";
import { CSSProperties } from "@material-ui/core/styles/withStyles";
import IStyleProps from "src/styles/utils";
import HLSPlayer from "src/components/video/HLSSource";
import Player360 from "src/components/Player360";
import * as classNames from "classnames";
import { ICameraInfo, ISelectedWallTile } from "../types/VideoWall";
import IconButton from "@material-ui/core/IconButton";
import VideoIcon from "@material-ui/icons/Videocam";
import Popover from "@material-ui/core/Popover";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Visibility from "@material-ui/icons/Visibility";
import Check from "@material-ui/icons/Check";
import blue from "@material-ui/core/colors/blue";
import Typography from "@material-ui/core/Typography";
import { CameraType } from "../../../types/Camera";
// import DialogTitle from "@material-ui/core/DialogTitle";
// import Dialog from "@material-ui/core/Dialog";

export interface IProps {
  customStyle?: any;
  selectedCamera: ISelectedWallTile;
  listCamera: ICameraInfo[];
  className?: string;
  status: string;
  index: number;
  isFullScreen: boolean;
  setStatus: (status: string) => void;
  quickView: (src: string, name: string, type: string) => void;
  selectCamera: (cameraId: string, index: number) => void;
  onClickTile?: (index: number) => void;
}

const styles = (theme: Theme): { [k: string]: CSSProperties } => ({
  camera: {
    position: "absolute",
    bottom: 0,
    right: 0,
    zIndex: 10
  },
  quickView: {
    position: "absolute",
    bottom: 0,
    left: 0,
    zIndex: 10
  },
  cssBlue: {
    color: blue[500]
  },
  container: {
    height: "100%"
  },
  cameraName: {
    left: "50%",
    transform: "translate(-50%, -50%)",
    bottom: 0,
    position: "absolute",
    color: "white",
    zIndex: 9,
    fontSize: "10px",
    backgroundColor: "rgba(0, 0, 0, 0.5)"
  }
});

interface IState {
  popover: any;
}

class VideoTile extends React.Component<IStyleProps & IProps, IState> {
  public state = {
    popover: null
  };
  public popup: any;
  public handleClosePopup = () => {
    this.setState({
      popover: null
    });
  };

  public handleClickPopup = (event: any) => {
    this.setState({
      popover: event.currentTarget
    });
  };

  public handleSelectCamera = (id: string, index: number) => {
    const { selectCamera, setStatus } = this.props;
    selectCamera(id, index);
    setStatus("edit");
    this.handleClosePopup();
  };

  public getRef = (anchorEl: any) => {
    this.popup = anchorEl;
  };

  private onClickTile = () => {
    const { index, onClickTile } = this.props;
    if (onClickTile) {
      onClickTile(index);
    }
  };

  public render() {
    const {
      selectedCamera,
      classes,
      listCamera,
      className,
      index,
      quickView,
      customStyle,
      isFullScreen
    } = this.props;

    let src = null;
    let cameraName = null;
    let cameraType = "stream";
    const cameraInfo = listCamera.find(el => {
      return el.CameraId === selectedCamera[index];
    });
    if (cameraInfo) {
      src = cameraInfo.CameraUrl;
      cameraName = cameraInfo.CameraName;
      cameraType =
        cameraInfo.PointDeviceType === CameraType.B360 ? "stream360" : "stream";
    }
    return (
      <div
        className={classNames(className, classes.container)}
        style={customStyle}
        onClick={this.onClickTile}
      >
        {!isFullScreen && src && (
          <div className={classes.quickView}>
            <IconButton
              className={classes.button}
              onClick={quickView.bind(this, src, cameraName, cameraType)}
            >
              <Visibility
                color="secondary"
                className={classNames(classes.cssBlue)}
              />
            </IconButton>
          </div>
        )}
        {cameraName && (
          <Typography variant="subtitle1" className={classes.cameraName}>
            {cameraName}
          </Typography>
        )}
        <div className={classes.camera}>
          {!isFullScreen && (
            <IconButton
              className={classes.button}
              onClick={this.handleClickPopup}
              buttonRef={this.getRef}
            >
              <VideoIcon color={src ? "secondary" : "error"} />
            </IconButton>
          )}

          <Popover
            open={Boolean(this.state.popover)}
            anchorEl={this.popup}
            onClose={this.handleClosePopup}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right"
            }}
            transformOrigin={{
              vertical: "bottom",
              horizontal: "right"
            }}
          >
            <List component="nav">
              {listCamera.map((el, cameraIndex) => {
                return (
                  <ListItem
                    key={cameraIndex}
                    button={true}
                    onClick={this.handleSelectCamera.bind(
                      this,
                      el.CameraId,
                      index
                    )}
                  >
                    {selectedCamera[index] &&
                      selectedCamera[index] === el.CameraId && (
                        <ListItemIcon>
                          <Check />
                        </ListItemIcon>
                      )}
                    <ListItemText inset={true} primary={el.CameraName} />
                  </ListItem>
                );
              })}
            </List>
          </Popover>
        </div>
        {src &&
          cameraInfo &&
          cameraInfo.PointDeviceType !== CameraType.B360 && (
            <HLSPlayer src={src} middle={true} type="stream" control={[]} />
          )}
        {src &&
          cameraInfo &&
          cameraInfo.PointDeviceType === CameraType.B360 && (
            <Player360 src={src} disableControl={true} />
          )}
      </div>
    );
  }
}

export default withStyles(styles)(VideoTile);

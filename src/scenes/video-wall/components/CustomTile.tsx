import * as React from "react";

import "./style.css";
import { withStyles, Theme } from "@material-ui/core/styles";
import { CSSProperties } from "@material-ui/core/styles/withStyles";
import IStyleProps from "src/styles/utils";
import HLSPlayer from "src/components/video/HLSSource";
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
// import DialogTitle from "@material-ui/core/DialogTitle";
// import Dialog from "@material-ui/core/Dialog";

export interface IProps {
  selectedCamera: ISelectedWallTile;
  listCamera: ICameraInfo[];
  className: string;
  status: string;
  cameraName: string | null;
  src: string | null;
  index: number;
  quickView: (src: string, name: string) => void;
  selectCamera: (cameraId: string, index: number) => void;
}

const styles = (theme: Theme): { [k: string]: CSSProperties } => ({
  camera: {
    position: "absolute",
    bottom: 0,
    right: 0,
    zIndex: 10
  },
  cssBlue: {
    color: blue[500]
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

  public render() {
    const {
      selectedCamera,
      classes,
      listCamera,
      className,
      cameraName,
      src,
      status,
      index,
      quickView,
      selectCamera
    } = this.props;
    return (
      <div className={className}>
        {status === "view" &&
          src && (
            <div className={classes.camera}>
              <IconButton
                className={classes.button}
                onClick={quickView.bind(this, src, cameraName)}
              >
                <Visibility
                  color="secondary"
                  className={classNames(classes.cssBlue)}
                />
              </IconButton>
            </div>
          )}
        {status === "edit" && (
          <div className={classes.camera}>
            <IconButton
              className={classes.button}
              onClick={this.handleClickPopup}
            >
              <VideoIcon color={src ? "secondary" : "error"} />
            </IconButton>
            <Popover
              open={Boolean(this.state.popover)}
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
                      onClick={selectCamera.bind(this, el.CameraId, index)}
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
        )}
        {src && (
          <HLSPlayer src={src} middle={true} type="stream" control={[]} />
        )}
      </div>
    );
  }
}

export default withStyles(styles)(VideoTile);

import * as React from "react";

import "./style.css";
import { withStyles, Theme } from "@material-ui/core/styles";
import { CSSProperties } from "@material-ui/core/styles/withStyles";
import IStyleProps from "src/styles/utils";
import * as classNames from "classnames";
import { ICameraLayout, ICustomTile } from "../types/Layout";
import {
  ICCTV,
  IVideoWall,
  ICameraInfo,
  IWallTileUpdate,
  ISelectedWallTile
} from "../types/VideoWall";
import blue from "@material-ui/core/colors/blue";
import Rnd from "react-rnd";
// import DialogTitle from "@material-ui/core/DialogTitle";
// import Dialog from "@material-ui/core/Dialog";
import VideoTile from "./VideoTile";
import Fullscreen from "react-full-screen";

export interface IProps {
  layout: ICameraLayout;
  selectedCamera: ISelectedWallTile;
  listCTTV: ICCTV[];
  listCamera: ICameraInfo[];
  listTile: ICustomTile[];
  videoWall: IVideoWall;
  status: string;
  isFullScreen: boolean;
  handleSetFullScreen: (isFull: boolean) => void;
  selectWallTile: (info: IWallTileUpdate) => void;
  unSelectWallTile: (info: IWallTileUpdate) => void;
  openFloatingVideo: (src: string, name: string, type: string) => void;
  updateTile: (tile: ICustomTile) => void;
  setStatus: (status: string) => void;
  removeTile: (index: number) => void;
}

const styles = (theme: Theme): { [k: string]: CSSProperties } => ({
  container: {
    display: "flex",
    position: "relative",
    left: "50%",
    transform: "translate(-50%)",
    "justify-content": "center",
    "align-items": "center",
    height: "calc(100% - 160px)",
    width: "134vh",
    backgroundColor: "#677284"
  },
  root: {
    height: "100%"
  },
  camera: {
    position: "absolute",
    bottom: 0,
    right: 0,
    zIndex: 10
  },
  menu: {
    position: "relative",
    bottom: "200px",
    top: 0,
    zIndex: 11,
    height: "400px",
    width: "200px",
    transformOrigin: "0 0 0"
  },
  fullScreen: {
    background: "black"
  },
  cssBlue: {
    color: blue[500]
  },
  customTile: {
    background: "#000",
    border: "1px solid #8f949c"
  }
});

interface IState {
  popover: any;
  customTile: any;
  isFull: boolean;
  width: number;
  height: number;
  selectedTileIndex: number;
}

class VideoWall extends React.Component<IStyleProps & IProps, IState> {
  public state = {
    popover: {},
    customTile: {},
    width: 0,
    height: 0,
    // anchorEl: undefined,
    // dialogEl: undefined,
    isFull: false,
    selectedTileIndex: -1
  };

  public bound: any;

  public handleClosePopup = (index: number) => {
    this.setState({
      popover: {
        [index]: null
      }
    });
  };

  // public handleCloseDialog = () => {
  //   this.setState({ dialogEl: null });
  // };

  public handleClickPopup = (index: number, event: any) => {
    this.setState({
      popover: {
        [index]: event.currentTarget
      }
    });
  };

  // public handleClickDialog = (event: any) => {
  //   this.setState({ dialogEl: event.currentTarget });
  // };

  public handleFullScreen = (isFull: boolean) => {
    const { handleSetFullScreen } = this.props;
    handleSetFullScreen(isFull);
  };

  public selectCamera = (id: string, index: number) => {
    const { selectWallTile, unSelectWallTile, selectedCamera } = this.props;
    if (!selectedCamera[index] || selectedCamera[index] !== id) {
      selectWallTile({ tileIndex: index, cameraId: id });
    } else {
      unSelectWallTile({ tileIndex: index, cameraId: id });
    }
    this.setState({
      popover: {}
    });
  };

  public quickView = (src: string, name: string, type: string) => {
    const { openFloatingVideo } = this.props;
    openFloatingVideo(src, name, type);
    this.setState({
      popover: {}
    });
  };

  public handleResizeTile = (
    id: number,
    e: any,
    direction: any,
    ref: any,
    delta: any,
    position: any
  ) => {
    const { updateTile, setStatus } = this.props;
    setStatus("edit");
    updateTile({
      id,
      h: ref.offsetHeight / ref.offsetParent.offsetHeight,
      w: ref.offsetWidth / ref.offsetParent.offsetWidth,
      x: position.x / ref.offsetParent.offsetWidth,
      y: position.y / ref.offsetParent.offsetHeight
    });
  };

  public handleDragStop = (id: number, e: any, d: any) => {
    const { updateTile, setStatus } = this.props;
    setStatus("edit");
    updateTile({
      id,
      h: d.node.offsetHeight / d.node.offsetParent.offsetHeight,
      w: d.node.offsetWidth / d.node.offsetParent.offsetWidth,
      x: d.x / d.node.offsetParent.offsetWidth,
      y: d.y / d.node.offsetParent.offsetHeight
    });
  };

  public getBound = (bound: any) => {
    this.bound = bound;
  };

  public updateDimensions() {
    if (this.bound) {
      this.setState({
        width: this.bound.offsetWidth,
        height: this.bound.offsetHeight
      });
    }
  }

  public componentDidMount() {
    window.addEventListener("resize", this.updateDimensions.bind(this));
    window.addEventListener("keydown", this.deleteTile.bind(this));
  }

  /**
   * Remove event listener
   */
  public componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this));
    window.removeEventListener("keydown", this.deleteTile.bind(this));
  }

  private deleteTile = (event: any) => {
    const { removeTile } = this.props;
    if (
      this.state.selectedTileIndex > -1 &&
      (event.keyCode === 8 || event.keyCode === 46)
    ) {
      removeTile(this.state.selectedTileIndex);
    }
  };

  private selectWallTile = (index: number) => {
    this.setState({
      selectedTileIndex: index
    });
  };

  public render() {
    const {
      layout,
      selectedCamera,
      listTile,
      status,
      isFullScreen,
      classes,
      videoWall,
      listCamera,
      setStatus
    } = this.props;
    return (
      <div className={classes.container} ref={this.getBound}>
        <Fullscreen
          enabled={isFullScreen}
          onChange={this.handleFullScreen}
          // onChange={(isFullscreenEnabled: any) => this.setState({isFullscreenEnabled})}
        >
          {layout &&
            videoWall &&
            layout.tileData.map((tile, index) => {
              const tileClass = classNames({
                "grid-slot": true,
                x0: tile.x === 0,
                x2: tile.x === 2,
                x4: tile.x === 4,
                x3: tile.x === 3,
                x6: tile.x === 6,
                x8: tile.x === 8,
                x9: tile.x === 9,
                x10: tile.x === 10,
                y0: tile.y === 0,
                y2: tile.y === 2,
                y3: tile.y === 3,
                y4: tile.y === 4,
                y6: tile.y === 6,
                y8: tile.y === 8,
                y9: tile.y === 9,
                y10: tile.y === 10,
                s2x2: tile.s === "2x2",
                s3x3: tile.s === "3x3",
                s4x4: tile.s === "4x4",
                s8x8: tile.s === "8x8",
                s6x6: tile.s === "6x6",
                s12x12: tile.s === "12x12"
              });

              return (
                <VideoTile
                  key={index}
                  className={tileClass}
                  selectedCamera={selectedCamera}
                  listCamera={listCamera}
                  status={status}
                  index={index}
                  quickView={this.quickView}
                  selectCamera={this.selectCamera}
                  isFullScreen={isFullScreen}
                  setStatus={setStatus}
                />
              );
            })}
          {!layout &&
            videoWall &&
            listTile &&
            setStatus &&
            this.bound &&
            listTile.map(el => {
              return (
                <Rnd
                  bounds="parent"
                  className={classes.customTile}
                  position={{
                    x: el.x * this.bound.offsetWidth,
                    y: el.y * this.bound.offsetHeight
                  }}
                  size={{
                    width: el.w * this.bound.offsetWidth,
                    height: el.h * this.bound.offsetHeight
                  }}
                  minHeight={120}
                  minWidth={200}
                  key={el.id}
                  onDragStop={this.handleDragStop.bind(this, el.id)}
                  onResize={this.handleResizeTile.bind(this, el.id)}
                >
                  <VideoTile
                    onClickTile={this.selectWallTile}
                    key={el.id}
                    selectedCamera={selectedCamera}
                    listCamera={listCamera}
                    status={status}
                    index={el.id}
                    quickView={this.quickView}
                    selectCamera={this.selectCamera}
                    isFullScreen={isFullScreen}
                    setStatus={setStatus}
                  />
                </Rnd>
              );
            })}
          {/* {!layout &&
            status === "view" &&
            listTile &&
            listTile.map(el => {
              const parentBound = this.bound.firstChild;
              const tileStyle = {
                position: "absolute",
                height: el.h * parentBound.offsetHeight,
                width: el.w * parentBound.offsetWidth,
                top: 0,
                left: 0,
                transform: `translate(${el.x *
                  parentBound.offsetWidth}px, ${el.y *
                  parentBound.offsetHeight}px)`
              };
              return (
                <VideoTile
                  key={el.id}
                  customStyle={tileStyle}
                  className={classes.customTile}
                  selectedCamera={selectedCamera}
                  listCamera={listCamera}
                  status={status}
                  index={el.id}
                  quickView={this.quickView}
                  selectCamera={this.selectCamera}
                  isFullScreen={isFullScreen}
                  setStatus={setStatus}
                />
              );
            })} */}
        </Fullscreen>
      </div>
    );
  }
}

export default withStyles(styles)(VideoWall);

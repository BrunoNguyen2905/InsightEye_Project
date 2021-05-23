import * as React from "react";
import * as Hls from "hls.js";
import Marzipano from "marzipano";
import VideoAsset from "./VideoAsset";

import { withStyles } from "@material-ui/core/styles";
import styles from "./style";
import { IStyleTypeProps } from "src/styles/utils";
import PlayArrow from "@material-ui/icons/PlayArrow";
import Pause from "@material-ui/icons/Pause";
import VolumeUp from "@material-ui/icons/VolumeUp";
import VolumeMute from "@material-ui/icons/VolumeMute";
import Fullscreen from "@material-ui/icons/Fullscreen";
import FullscreenExit from "@material-ui/icons/FullscreenExit";
import IconButton from "@material-ui/core/IconButton";
import * as classNames from "classnames";
import Seekbar from "./Seekbar";
import { CircularProgress } from "@material-ui/core";
import ArrowDropDown from "@material-ui/icons/ArrowDropDown";
import ArrowDropUp from "@material-ui/icons/ArrowDropUp";
import ArrowLeft from "@material-ui/icons/ArrowLeft";
import ArrowRight from "@material-ui/icons/ArrowRight";
import ZoomIn from "@material-ui/icons/AddCircleOutline";
import ZoomOut from "@material-ui/icons/RemoveCircleOutline";

interface IPlayer360Props {
  src: string;
  playing?: boolean;
  fullscreen?: boolean;
  mute?: boolean;
  disableControl?: boolean;
  currentTime?: number;
  onTimeUpdate?: (time: number) => void;
  onLoadedmetadata?: (duration: number) => void;
}
interface IPlayer360State {
  playing: boolean;
  isFullscreen: boolean;
  volumn: number;
  mute: boolean;
  isloading: boolean;
  duration: number;
  currentTime: number;
}
// enum ControlDirection {
//   LEFT = "left",
//   RIGHT = "right",
//   UP = "up",
//   DOWN = "down",
// }
// Wait for an element to reach the given readyState by polling.
// The HTML5 video element exposes a `readystatechange` event that could be
// listened for instead, but it seems to be unreliable on some browsers.
function waitForReadyState(
  element: HTMLVideoElement,
  readyState: number,
  interval: number,
  done: (a: any, b: boolean) => void
) {
  const timer = setInterval(() => {
    if (element.readyState >= readyState) {
      clearInterval(timer);
      done(null, true);
    }
  }, interval);
}

class Player360 extends React.Component<
  IPlayer360Props & IStyleTypeProps<typeof styles>,
  IPlayer360State
> {
  private playerRef: React.RefObject<HTMLDivElement>;
  private currentRef: React.RefObject<HTMLDivElement>;
  private viewIn: React.RefObject<HTMLDivElement>;
  private viewOut: React.RefObject<HTMLDivElement>;
  private viewLeft: React.RefObject<HTMLDivElement>;
  private viewRight: React.RefObject<HTMLDivElement>;
  private viewUp: React.RefObject<HTMLDivElement>;
  private viewDown: React.RefObject<HTMLDivElement>;
  private asset: VideoAsset;
  private videoElement: HTMLVideoElement;
  private hls: Hls;
  private updateEvents: {
    [key in keyof IPlayer360Props]: (value: any) => void
  };

  constructor(props: IPlayer360Props & IStyleTypeProps<typeof styles>) {
    super(props);
    this.playerRef = React.createRef();
    this.currentRef = React.createRef();
    this.viewIn = React.createRef();
    this.viewOut = React.createRef();
    this.viewLeft = React.createRef();
    this.viewRight = React.createRef();
    this.viewUp = React.createRef();
    this.viewDown = React.createRef();
    this.hls = new Hls({
      fragLoadingMaxRetry: 100
    });
    this.state = {
      playing: false,
      isFullscreen: false,
      volumn: 100,
      mute: false,
      isloading: false,
      duration: 1,
      currentTime: 0
    };

    this.updateEvents = {
      src: value => this.updateSrc(value),
      playing: value => this.updatePlaying(value),
      fullscreen: value => this.updateFullScreen(value),
      mute: value => this.updateMute(value),
      currentTime: value => this.updateCurrentTime(value)
    };
  }

  public componentDidMount() {
    if (!this.playerRef.current) {
      return;
    }

    // Create viewer.
    // Video requires WebGL support.
    const viewerOpts: Marzipano.IViewerOption = { stageType: "webgl" };
    const viewer = new Marzipano.Viewer(this.playerRef.current, viewerOpts);
    if (
      this.viewUp.current &&
      this.viewDown.current &&
      this.viewLeft.current &&
      this.viewRight.current &&
      this.viewIn.current &&
      this.viewOut.current
    ) {
      const velocity = 0.7;
      const friction = 3;

      // Associate view controls with elements.
      const controls = viewer.controls();
      controls.registerMethod(
        "upElement",
        new Marzipano.ElementPressControlMethod(
          this.viewUp.current,
          "y",
          -velocity,
          friction
        ),
        true
      );
      controls.registerMethod(
        "downElement",
        new Marzipano.ElementPressControlMethod(
          this.viewDown.current,
          "y",
          velocity,
          friction
        ),
        true
      );
      controls.registerMethod(
        "leftElement",
        new Marzipano.ElementPressControlMethod(
          this.viewLeft.current,
          "x",
          -velocity,
          friction
        ),
        true
      );
      controls.registerMethod(
        "rightElement",
        new Marzipano.ElementPressControlMethod(
          this.viewRight.current,
          "x",
          velocity,
          friction
        ),
        true
      );
      controls.registerMethod(
        "inElement",
        new Marzipano.ElementPressControlMethod(
          this.viewIn.current,
          "zoom",
          -velocity,
          friction
        ),
        true
      );
      controls.registerMethod(
        "outElement",
        new Marzipano.ElementPressControlMethod(
          this.viewOut.current,
          "zoom",
          velocity,
          friction
        ),
        true
      );
    }
    // Create asset and source.
    const asset = new VideoAsset();
    this.asset = asset;
    const source = new Marzipano.SingleAssetSource(asset);

    // Create geometry.
    // This is a trivial equirectangular geometry with a single level.
    // The level size need not match the actual video dimensions because it is
    // only used to determine the most appropriate level to render, and no such
    // choice has to be made in this case.
    const geometry = new Marzipano.EquirectGeometry([{ width: 1 }]);

    // Create view.
    // We display the video at a fixed vertical fov.
    // const limiter = Marzipano.RectilinearView.limit.vfov(
    //   (90 * Math.PI) / 180 * 0.5,
    //   (90 * Math.PI) / 180 * 0.5
    // );
    const limiter = Marzipano.RectilinearView.limit.traditional(
      2048,
      ((90 * Math.PI) / 180) * 1.5
    );
    const view = new Marzipano.RectilinearView({ fov: Math.PI / 2 }, limiter);

    // Create scene.
    const scene = viewer.createScene({
      source,
      geometry,
      view
    });

    // Display scene.
    scene.switchTo();

    if (this.currentRef.current) {
      this.currentRef.current.addEventListener(
        "webkitfullscreenchange",
        this.onFullScreenChange
      );
      document.addEventListener("mozfullscreenchange", this.onFullScreenChange);
      this.currentRef.current.addEventListener(
        "fullscreenchange",
        this.onFullScreenChange
      );
    }

    for (const key in this.props) {
      if (this.props[key]) {
        this.updateProp(key as keyof IPlayer360Props, this.props[key]);
      }
    }
  }

  private onFullScreenChange = () => {
    const { isFullscreen } = this.state;
    this.setState({
      isFullscreen: !isFullscreen
    });
  };

  public componentDidUpdate(prevProps: IPlayer360Props) {
    for (const key in this.props) {
      if (this.props[key] !== prevProps[key]) {
        this.updateProp(key as keyof IPlayer360Props, this.props[key]);
      }
    }
  }

  private updateProp(key: keyof IPlayer360Props, value: any) {
    const updateFunc = this.updateEvents[key];
    if (updateFunc) {
      updateFunc(value);
    }
  }

  private onPlay = () => {
    this.setState({
      playing: true
    });
  };

  private onPause = () => {
    this.setState({
      playing: false
    });
  };
  private onVolumeChange = () => {
    this.setState({
      mute: this.videoElement.muted,
      volumn: this.videoElement.volume * 100
    });
  };

  private onUpdatePlayingTime(time: number) {
    this.setState({
      currentTime: time
    });

    const onTimeUpdate = this.props.onTimeUpdate;
    if (onTimeUpdate) {
      onTimeUpdate(time);
    }
  }

  private createVideo(): HTMLVideoElement {
    const video = document.createElement("video");
    video.onplay = this.onPlay;
    video.onpause = this.onPause;
    video.onvolumechange = this.onVolumeChange;
    video.ontimeupdate = () => this.onUpdatePlayingTime(video.currentTime);

    video.oncanplay = () => {
      this.setState({
        isloading: false
      });
    };
    video.onwaiting = () => {
      this.setState({
        isloading: true
      });
    };
    video.ondurationchange = () => {
      this.setState({
        duration: video.duration
      });
    };
    video.onloadedmetadata = () => {
      const onLoadedmetadata = this.props.onLoadedmetadata;
      if (!onLoadedmetadata) {
        return;
      }
      onLoadedmetadata(video.duration);
    };
    return video;
  }

  private playerDetach() {
    if (!this.videoElement) {
      return;
    }
    this.videoElement.pause();
    this.videoElement.removeEventListener("play", this.onPlay);
    this.videoElement.removeEventListener("pause", this.onPause);
  }
  private updateSrc(src: string) {
    this.playerDetach();
    const videoElement = this.createVideo();
    if (!videoElement) {
      return;
    }
    this.videoElement = videoElement;
    this.setState({
      volumn: videoElement.volume * 100
    });

    videoElement.oncanplay = () => {
      this.setState({
        isloading: false
      });
    };
    videoElement.onwaiting = () => {
      this.setState({
        isloading: true
      });
    };

    this.hls.loadSource(src);
    this.hls.attachMedia(videoElement);
    this.setState({
      isloading: true
    });
    this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
      videoElement.play();
      waitForReadyState(videoElement, videoElement.HAVE_METADATA, 100, () => {
        waitForReadyState(
          videoElement,
          videoElement.HAVE_ENOUGH_DATA,
          100,
          () => {
            videoElement.play();
            this.asset.setVideo(videoElement);
          }
        );
      });
    });
    this.hls.on(Hls.Events.ERROR, (error: string, errorData: Hls.errorData) => {
      if (errorData.fatal) {
        switch (errorData.type) {
          case Hls.ErrorTypes.NETWORK_ERROR:
            // try to recover network error
            console.log("fatal network error encountered, try to recover");
            this.hls.startLoad();
            break;
          case Hls.ErrorTypes.MEDIA_ERROR:
            console.log("fatal media error encountered, try to recover");
            this.hls.recoverMediaError();
            break;
          default:
            // cannot recover
            this.hls.destroy();
            break;
        }
      }
    });
  }

  private updatePlaying(newValue: boolean) {
    if (newValue === this.state.playing) {
      return;
    }
    if (newValue) {
      this.pcPlay();
    } else {
      this.pcPause();
    }
  }

  private updateFullScreen(newValue: boolean) {
    if (newValue === this.state.isFullscreen) {
      return;
    }
    if (newValue) {
      this.pcFullscreen();
    } else {
      this.pcFullscreenExit();
    }
  }

  private updateMute(newValue: boolean) {
    if (newValue === this.state.mute) {
      return;
    }
    this.videoElement.muted = newValue;
  }

  private updateCurrentTime(newValue: number) {
    if (newValue === this.state.currentTime) {
      return;
    }
    this.videoElement.currentTime = newValue;
  }

  private pcPlay = () => {
    this.videoElement.play();
  };
  private pcPause = () => {
    this.videoElement.pause();
  };

  private pcVoumnToggle = () => {
    this.videoElement.muted = !this.state.mute;
  };
  private pcVolumeChange = (value: number) => {
    this.videoElement.muted = false;
    this.videoElement.volume = value / 100;
  };

  private fullScreenFunc() {
    const current = this.currentRef.current;
    if (!current) {
      return;
    }
    const fsFunc =
      current.requestFullscreen ||
      current.webkitRequestFullscreen ||
      ((current as any)
        .mozRequestFullScreen as typeof current.requestFullscreen);
    return fsFunc;
  }

  private pcFullscreen = () => {
    const current = this.currentRef.current;
    if (!current) {
      return;
    }
    const fsFunc = this.fullScreenFunc();
    if (!fsFunc) {
      return;
    }
    fsFunc.apply(current);
  };
  private pcFullscreenExit = () => {
    if (this.state.isFullscreen) {
      const fsFunc =
        document.exitFullscreen ||
        document.webkitExitFullscreen ||
        (document as any).mozCancelFullScreen;
      fsFunc.apply(document);
    }
  };

  private pcVideoSeek = (value: number) => {
    console.log("pcVideoSeek", value);
    this.videoElement.currentTime = value;
  };

  public render() {
    const { classes, disableControl } = this.props;
    const {
      playing,
      isFullscreen,
      mute,
      volumn,
      isloading,
      duration,
      currentTime
    } = this.state;
    const pcPlay = () => this.pcPlay();
    const pcPause = () => this.pcPause();
    const pcFullscreen = () => this.pcFullscreen();
    const pcFullscreenExit = () => this.pcFullscreenExit();
    const pcVoumnToggle = () => this.pcVoumnToggle();
    const pcVolumeSeek = (value: number) => this.pcVolumeChange(value);
    const pcVideoSeek = (value: number) =>
      this.pcVideoSeek((value / 100) * duration);
    return (
      <div ref={this.currentRef} className={classes.wrap}>
        <div ref={this.playerRef} className={classes.wrap} />
        {isloading && (
          <div className={classes.loadingWrap}>
            <CircularProgress />
          </div>
        )}
        <div className={classes.wrapperButton}>
          <div className={classes.zoomButton}>
            <div className={classNames(classes.in)} ref={this.viewIn}>
              <IconButton className={classes.controlBtn}>
                <ZoomIn />
              </IconButton>
            </div>
            <div className={classNames(classes.out)} ref={this.viewOut}>
              <IconButton className={classes.controlBtn} id="viewOut">
                <ZoomOut />
              </IconButton>
            </div>
          </div>
          <div className={classes.adsButton}>
            <div className={classNames(classes.left)} ref={this.viewLeft}>
              <IconButton className={classes.controlBtn} id="viewLeft">
                <ArrowLeft fontSize="inherit" />
              </IconButton>
            </div>
            <div className={classNames(classes.right)} ref={this.viewRight}>
              <IconButton className={classes.controlBtn} id="viewRight">
                <ArrowRight fontSize="inherit" />
              </IconButton>
            </div>
            <div className={classNames(classes.up)} ref={this.viewUp}>
              <IconButton className={classes.controlBtn} id="viewUp">
                <ArrowDropUp fontSize="inherit" />
              </IconButton>
            </div>
            <div className={classNames(classes.down)} ref={this.viewDown}>
              <IconButton className={classes.controlBtn} id="viewDown">
                <ArrowDropDown fontSize="inherit" />
              </IconButton>
            </div>
          </div>
        </div>
        {!disableControl && (
          <div className={classes.videoControls} id="video-controls">
            <IconButton
              className={classes.controlBtn}
              onClick={playing ? pcPause : pcPlay}
            >
              {playing && <Pause />}
              {!playing && <PlayArrow />}
            </IconButton>
            <IconButton
              className={classNames(classes.controlBtn, classes.volumn)}
              onClick={pcVoumnToggle}
            >
              {mute && <VolumeMute />}
              {!mute && <VolumeUp />}
            </IconButton>
            <div
              className={classNames(classes.controlBtn, classes.volumnSeekbar)}
            >
              <Seekbar value={mute ? 0 : volumn} seek={pcVolumeSeek} />
            </div>
            <div className={classNames(classes.controlBtn, classes.seekbar)}>
              <Seekbar
                value={(currentTime * 100) / duration}
                seek={pcVideoSeek}
              />
            </div>
            {this.fullScreenFunc() && (
              <IconButton
                onClick={isFullscreen ? pcFullscreenExit : pcFullscreen}
                className={classNames(classes.controlBtn, classes.fullscreen)}
              >
                {!isFullscreen && <Fullscreen />}
                {isFullscreen && <FullscreenExit />}
              </IconButton>
            )}
          </div>
        )}
      </div>
    );
  }

  public componentWillUnmount() {
    if (this.currentRef.current) {
      this.currentRef.current.removeEventListener(
        "webkitfullscreenchange",
        this.onFullScreenChange
      );
      document.removeEventListener(
        "mozfullscreenchange",
        this.onFullScreenChange
      );
      this.currentRef.current.removeEventListener(
        "fullscreenchange",
        this.onFullScreenChange
      );
    }
    if (this.hls) {
      this.hls.destroy();
    }
  }
}

export default withStyles(styles, { withTheme: true })(Player360);

import * as React from "react";
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

interface IPlayer360Props {
  src: string;
  playing?: boolean;
  fullscreen?: boolean;
  mute?: boolean;
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

class Video360 extends React.Component<
  IPlayer360Props & IStyleTypeProps<typeof styles>,
  IPlayer360State
> {
  private playerRef: React.RefObject<HTMLDivElement>;
  private currentRef: React.RefObject<HTMLDivElement>;
  private asset: VideoAsset;
  private videoElement: HTMLVideoElement;

  private updateEvents: {
    [key in keyof IPlayer360Props]: (value: any) => void
  };
  constructor(props: IPlayer360Props & IStyleTypeProps<typeof styles>) {
    super(props);
    this.playerRef = React.createRef();
    this.currentRef = React.createRef();

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

    this.setState({
      volumn: videoElement.volume * 100
    });
    this.videoElement = videoElement;

    videoElement.src = src;
    videoElement.crossOrigin = "anonymous";

    videoElement.autoplay = true;
    videoElement.play();
    waitForReadyState(videoElement, videoElement.HAVE_METADATA, 100, () => {
      waitForReadyState(
        videoElement,
        videoElement.HAVE_ENOUGH_DATA,
        100,
        () => {
          this.asset.setVideo(videoElement);
        }
      );
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
    const { classes } = this.props;
    const {
      playing,
      isFullscreen,
      mute,
      volumn,
      isloading,
      duration,
      currentTime
    } = this.state;
    console.log(currentTime, duration);
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
    this.videoElement.pause();
  }
}

export default withStyles(styles, { withTheme: true })(Video360);

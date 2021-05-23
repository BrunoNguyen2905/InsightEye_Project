import * as React from "react";
import * as Hls from "hls.js";
import * as classNames from "classnames";
export interface IProps {
  className?: string;
  src: string;
  middle?: boolean;
  control?: string[];
  type?: string;
  options?: any;
  onLoad?: (player: any) => void;
  onTimeUpdate?: (time: number) => void;
  currentTime?: number;
  start?: number;
  end?: number;
  onLoadedmetadata?: (event: PlyrEvent) => void;
}
import { withStyles, Theme } from "@material-ui/core/styles";
import { CSSProperties } from "@material-ui/core/styles/withStyles";
import IStyleProps from "src/styles/utils";
import Plyr from "plyr";
import { PlyrEvent } from "react-plyr";

const styles = (theme: Theme): { [k: string]: CSSProperties } => ({
  videoWrapper: {
    position: "relative",
    width: "100% !important",
    height: "100% !important",
    overflow: "hidden",
    "min-width": "100px !important"
    // objectFit: "fill"
  },
  videoFit: {
    objectFit: "fill"
  },
  video: {
    // top: "50%",
    // transform: "translate(0, -50%)",
    position: "relative",
    width: "100%",
    height: "auto",
    "max-height": "100%"
  },
  middle: {
    top: "50%",
    transform: "translate(0, -50%)"
  }
});

class HLSSource extends React.Component<IStyleProps & IProps, any> {
  public hls: Hls;
  public player: any;
  public bound: any;
  public video: any;
  constructor(props: IProps & IStyleProps) {
    super(props);
    this.hls = new Hls();
    this.state = {
      width: 1000
    };
  }

  public componentDidUpdate(prevProps: IProps) {
    const { src: prevSrc } = prevProps;
    const { src, type } = this.props;
    if (src !== prevSrc) {
      if (type === "stream") {
        this.hls.on(Hls.Events.MEDIA_ATTACHED, () => {
          this.hls.loadSource(src);
          this.playVideo();
        });
        this.hls.attachMedia(this.player);
      } else {
        this.video.source = {
          type: "video",
          sources: [
            {
              src,
              type: "video/mp4"
            }
          ]
        };
        this.playVideo();
      }
    }
    if (
      this.props.currentTime &&
      this.props.currentTime !== this.player.currentTime
    ) {
      this.video.currentTime = this.props.currentTime;
    }
  }

  public componentDidMount() {
    const { src, type, control } = this.props;
    let { options } = this.props;
    if (!options) {
      options = {};
    }
    if (control) {
      options.controls = control;
      options.duration = 10;
    }
    this.video = new Plyr(this.player, options);
    if (type === "stream") {
      this.hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        this.hls.loadSource(src);
        this.playVideo();
      });
      this.hls.attachMedia(this.player);
    } else {
      this.playVideo();
    }
    this.video.on("loadedmetadata", (event: PlyrEvent) => {
      const { onLoadedmetadata } = this.props;
      if (onLoadedmetadata) {
        onLoadedmetadata(event);
      }
    });
    this.video.on("timeupdate", () => {
      const { onTimeUpdate } = this.props;
      const time = this.video.currentTime;
      if (onTimeUpdate && time) {
        onTimeUpdate(time);
      }
    });
    window.addEventListener("resize", this.updateDimensions.bind(this));
  }

  private playVideo = () => {
    const playPromise = this.video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log("load ok");
          if (this.props.onLoad) {
            this.props.onLoad(this.player);
          }
        })
        .catch((error: any) => {
          console.log(error);
        });
    }
  };

  public componentWillUnmount() {
    // destroy hls video source
    if (this.hls) {
      this.hls.destroy();
    }
    window.removeEventListener("resize", this.updateDimensions.bind(this));
  }

  public updateDimensions() {
    if (this.player) {
      this.setState({
        width: this.bound.offsetWidth,
        height: this.bound.offsetHeight
      });
    }
  }

  public getRef = (player: any) => {
    this.player = player;
  };

  public getBound = (bound: any) => {
    this.bound = bound;
  };

  public render() {
    const { classes, className, type, src } = this.props;
    return (
      <div
        ref={this.getBound}
        className={classNames(classes.videoWrapper, className)}
      >
        {/* {this.state && this.state.height && this.state.width && */}
        <video
          className={classNames(
            classes.videoWrapper,
            this.state.width < 200 && classes.videoFit
          )}
          ref={this.getRef}
          // autoPlay={true}
          controls={true}
        >
          {type !== "stream" && <source src={src} type="video/mp4" />}
        </video>
        {/* } */}
      </div>
    );
  }
}

export default withStyles(styles)(HLSSource);

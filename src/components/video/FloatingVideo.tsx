import * as React from "react";

import { withStyles, Theme } from "@material-ui/core/styles";
import { CSSProperties } from "@material-ui/core/styles/withStyles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import IconButton from "@material-ui/core/IconButton";
import Videocam from "@material-ui/icons/Videocam";
import Close from "@material-ui/icons/Close";
import IStyleProps from "src/styles/utils";
import HLSSource from "./HLSSource";
import Rnd from "react-rnd";
import Player360 from "../Player360";
// import PlayerVideo360 from "../Player360/Video";
// import Plyr from "react-plyr";
export interface IProps {
  uuid: number;
  src: string;
  name: string;
  type: string;
  handleClose: (uuid: number) => void;
  selectedLib: string;
}

export interface IState {
  width: number | null;
  height: number | null;
}

const styles = (theme: Theme): { [k: string]: CSSProperties } => ({
  container: {
    position: "absolute",
    zIndex: 100000
  },
  headerDrag: {
    cursor: "pointer",
    paddingLeft: "15px",
    paddingRight: "17px",
    paddingTop: "8px",
    paddingBottom: "1px"
  },
  content: {
    padding: 0,
    paddingBottom: "0 !important",
    height: "calc(100% - 49px)",
    backgroundColor: "black"
  },
  card: {
    height: "100%"
  }
});
class FloatingVideo extends React.Component<IStyleProps & IProps, IState> {
  public bound: any;

  private onLoad = (player: any) => {
    this.update(player.clientHeight + 49, player.clientWidth);
  };
  constructor(props: IStyleProps & IProps) {
    super(props);
    this.state = {
      width: null,
      height: null
    };
  }

  public componentDidUpdate(prev: IProps) {
    if (prev.selectedLib !== this.props.selectedLib) {
      this.props.handleClose(this.props.uuid);
    }
  }

  public getBound = (bound: any) => {
    this.bound = bound;
  };
  private update(height: number, width: number) {
    console.log(this.bound);
    this.bound.updateSize({ height, width });
  }

  public render() {
    const { classes, uuid, src, name, handleClose, type } = this.props;
    return (
      <Rnd
        className={classes.container}
        ref={this.getBound}
        default={{
          x: window.innerWidth - 500 - (uuid - 1) * 50,
          y: 100 * uuid,
          width: 400,
          height: 300
        }}
        bounds="body"
        minHeight={200}
        minWidth={266}
        dragHandleClassName={classes.headerDrag}
      >
        <Card className={classes.card}>
          <CardHeader
            className={classes.headerDrag}
            avatar={<Videocam />}
            action={
              <IconButton onClick={handleClose.bind(this, uuid)}>
                <Close />
              </IconButton>
            }
            title={name}
          />
          <CardContent
            classes={{
              root: classes.content
            }}
          >
            {type === "video" && (
              <HLSSource
                src={src}
                middle={true}
                type="stream"
                onLoad={this.onLoad}
              />
            )}
            {type === "stream" && (
              <HLSSource src={src} type="stream" onLoad={this.onLoad} />
            )}
            {type === "stream360" && <Player360 src={src} />}
            {type === "video360" && <Player360 src={src} />}
          </CardContent>
        </Card>
      </Rnd>
    );
  }
}

export default withStyles(styles)(FloatingVideo);

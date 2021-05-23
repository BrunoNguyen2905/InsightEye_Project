import * as React from "react";

import { withStyles, Theme } from "@material-ui/core/styles";
import { CSSProperties } from "@material-ui/core/styles/withStyles";
import IStyleProps from "src/styles/utils";
import Toolbar from "../containers/Toolbar";
import LayoutDialog from "../containers/LayoutDialog";
import VideoWall from "../containers/VideoWall";
// export interface IProps {
// }

const styles = (theme: Theme): { [k: string]: CSSProperties } => ({
  container: {
    position: "relative",
    overflow: "hidden",
    height: "100%",
    background: "#2B3038"
  }
});
export interface IProps {
  selectedLib: string;
  loadListVideoWall: () => void;
  loadListCamera: () => void;
  initVideoWall: () => void;
}
class MainPage extends React.Component<IStyleProps & IProps, any> {
  public componentDidMount() {
    const { initVideoWall, loadListVideoWall, loadListCamera } = this.props;
    initVideoWall();
    loadListVideoWall();
    loadListCamera();
  }

  public componentDidUpdate(prev: IProps) {
    if (prev.selectedLib !== this.props.selectedLib) {
      const { initVideoWall, loadListVideoWall, loadListCamera } = this.props;
      initVideoWall();
      loadListVideoWall();
      loadListCamera();
    }
  }

  public render() {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        <Toolbar />
        <VideoWall />
        <LayoutDialog />
      </div>
    );
  }
}

export default withStyles(styles)(MainPage);

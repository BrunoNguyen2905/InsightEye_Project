import * as React from "react";

import MainMap from "../containers/MainMap";
import styles from "../styles/Hello";

// import { Link } from 'react-router-dom';
import { withStyles } from "@material-ui/core/styles";
import IStyleProps from "src/styles/utils";
export interface IProps {
  helloState: { width: number; height: number };
  updateBoundary?: (...args: any[]) => void;
}
// const Home = () => (<h1>Home <Link to="/about">About</Link></h1>);

function MapBoard({
  helloState,
  updateBoundary,
  classes
}: IStyleProps & IProps) {
  return (
    <div className={classes.hello} ref={updateBoundary}>
      <MainMap width={helloState.width} height={helloState.height} />
    </div>
  );
}

export default withStyles(styles, { withTheme: true })(MapBoard);

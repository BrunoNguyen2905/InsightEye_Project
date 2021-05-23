import * as React from "react";
import logoMin from "../assets/images/logo.png";
import logoFull from "../assets/images/logo_header.png";
import withStyles from "@material-ui/core/styles/withStyles";
import styles from "../styles/Logo";
import IStyleProps from "src/styles/utils";

export interface ILogoProps {
  open: boolean;
}
const Logo = ({ open, classes }: ILogoProps & IStyleProps) => (
  <img className={classes.image} src={open ? logoFull : logoMin} />
);

export default withStyles(styles, { withTheme: true })(Logo);

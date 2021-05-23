import * as React from "react";
import SearchIcon from "@material-ui/icons/Search";
import Typography from "@material-ui/core/Typography";
import { withStyles, createStyles, Theme } from "@material-ui/core/styles";
import IStyleProps from "../../styles/utils";

const styles = (theme: Theme) =>
  createStyles({
    notFound: {
      paddingTop: 0,
      marginTop: theme.spacing.unit * 2,
      marginBottom: theme.spacing.unit * 2
    },
    notFoundText: {
      display: "flex",
      textAlign: "center",
      justifyContent: "center"
    }
  });

interface IProps {
  text?: string;
}

const NotFoundCamera = ({
  classes,
  text = "Can not find any camera"
}: IStyleProps & IProps) => (
  <div className={classes.notFound}>
    <Typography className={classes.notFoundText} variant="subtitle1">
      {" "}
      <SearchIcon /> {text}
    </Typography>
  </div>
);

export default withStyles(styles)(NotFoundCamera);

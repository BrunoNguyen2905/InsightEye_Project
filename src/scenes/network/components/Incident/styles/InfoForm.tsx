import { CSSProperties } from "@material-ui/core/styles/withStyles";
import { createStyles, Theme } from "@material-ui/core/styles";

const styles = (theme: Theme): { [k: string]: CSSProperties } =>
  createStyles({
    wrap: {
      height: "100%"
    },
    title: {
      display: "flex",
      alignItems: "center",
      padding: theme.spacing.unit,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    },
    form: {
      height: "calc(100% - 64px)",
      overflow: "auto",
      paddingTop: theme.spacing.unit,
      paddingBottom: theme.spacing.unit * 2
    },
    hidden: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center"
    },
    cctvPreview: {
      width: "100%",
      height: "100%",
      backgroundColor: "black",
      paddingTop: "75%"
    },
    section: {
      paddingLeft: theme.spacing.unit * 2,
      paddingRight: theme.spacing.unit * 2
    },
    tab: {
      color: theme.palette.common.white
    },
    tabs: {
      marginTop: theme.spacing.unit * 2,
      backgroundColor: "#0096DA",
      color: theme.palette.common.white
    },
    submit: {
      marginLeft: "auto"
    },
    saveStatus: {
      marginLeft: theme.spacing.unit
    }
  });

export default styles;

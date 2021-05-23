import { CSSProperties } from "@material-ui/core/styles/withStyles";
import green from "@material-ui/core/colors/green";
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
    textTitle: {
      width: "400px"
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
      position: "relative",
      width: "100%",
      height: "100%",
      backgroundColor: "black",
      paddingTop: "75%"
    },
    preview: { width: "100%", position: "absolute", top: "0" },
    successCheckPreview: {
      color: green[500]
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
    checkBox: {
      height: "20px",
      marginTop: "37px"
    },
    plan: {
      padding: theme.spacing.unit * 2,
      color: theme.palette.common.white,
      backgroundColor: green[500]
    }
  });

export default styles;

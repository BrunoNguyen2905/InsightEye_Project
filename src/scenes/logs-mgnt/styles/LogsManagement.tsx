import { Theme, createStyles } from "@material-ui/core/styles";
const styles = (theme: Theme) =>
  createStyles({
    wrap: {
      position: "relative",
      // height: "100%",
      paddingTop: theme.spacing.unit,
      paddingBottom: theme.spacing.unit * 2,
      paddingRight: theme.spacing.unit * 2,
      paddingLeft: theme.spacing.unit * 2
    },
    control: {
      display: "flex",
      paddingRight: theme.spacing.unit * 2,
      paddingLeft: theme.spacing.unit * 2,
      paddingTop: theme.spacing.unit * 2,
      paddingBottom: theme.spacing.unit * 2,
      marginBottom: theme.spacing.unit * 2
    },
    add: {
      marginLeft: "auto"
    },
    paging: {
      paddingTop: theme.spacing.unit * 2,
      paddingBottom: theme.spacing.unit * 2,
      textAlign: "center"
    },
    row: {
      "&:nth-of-type(odd)": {
        backgroundColor: theme.palette.divider
      }
    },
    rowHeaded: {
      backgroundColor: "#181A1F",

      "& th": {
        color: theme.palette.common.white
      }
    },
    timeCell: {
      whiteSpace: "nowrap"
    }
  });

export default styles;

import { Theme } from "@material-ui/core/styles";
export const toolbarStyles = (theme: Theme) => ({
  container: {
    display: "flex",
    paddingRight: theme.spacing.unit * 2,
    paddingLeft: theme.spacing.unit * 2,
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2
  },
  input: {
    margin: theme.spacing.unit
  },
  formControl: {
    minWidth: 120
  },
  formUserControl: {
    minWidth: 240
  },
  resetButton: {
    marginLeft: theme.spacing.unit * 2
  }
});

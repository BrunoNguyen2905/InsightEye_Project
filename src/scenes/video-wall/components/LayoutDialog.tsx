import * as React from "react";
import { withStyles, Theme } from "@material-ui/core/styles";
import { CSSProperties } from "@material-ui/core/styles/withStyles";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import IStyleProps from "src/styles/utils";
import { ICameraLayout } from "../types/Layout";

const styles = (theme: Theme): { [k: string]: CSSProperties } => ({
  gridContainer: {
    marginLeft: theme.spacing.unit,
    marginBottom: theme.spacing.unit
  },
  textCamera: {
    textAlign: "center"
  },
  textHeader: {
    textAlign: "center"
  },
  container: {
    overflow: "hidden !important",
    height: "550px"
  },
  image: {
    "&:hover": {
      backgroundColor: "aquamarine",
      cursor: "pointer"
    }
  },
  customButton: {
    minWidth: "120px",
    margin: "auto"
  }
});

export interface IProps {
  listLayout: ICameraLayout[];
  showDialog: boolean;
  handleClose: () => void;
  selectLayout: (layout: ICameraLayout) => void;
}

class LayoutDialog extends React.Component<IStyleProps & IProps, any> {
  public render() {
    const {
      listLayout,
      showDialog,
      handleClose,
      selectLayout,
      classes
    } = this.props;

    return (
      <Dialog
        onClose={handleClose}
        open={showDialog}
        fullWidth={true}
        maxWidth="md"
        classes={{
          paper: classes.container
        }}
      >
        <DialogTitle className={classes.textHeader}>
          Choose a layout
        </DialogTitle>
        <Grid container={true} spacing={16} className={classes.gridContainer}>
          {listLayout.map(layout => {
            return (
              <Grid key={layout.quantity} item={true} xs={3}>
                <img
                  src={layout.srcImg}
                  onClick={selectLayout.bind(null, layout)}
                  className={classes.image}
                />
                <div className={classes.textCamera}>
                  {layout.quantity}{" "}
                  {layout.quantity === 1 ? "Camera" : "Cameras"}
                </div>
              </Grid>
            );
          })}
        </Grid>
        <Button
          className={classes.customButton}
          onClick={selectLayout.bind(null, null)}
          color="primary"
        >
          Custom Layout
        </Button>
      </Dialog>
    );
  }
}

export default withStyles(styles)(LayoutDialog);

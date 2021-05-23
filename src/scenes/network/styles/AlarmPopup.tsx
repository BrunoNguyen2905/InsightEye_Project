import { Theme } from "@material-ui/core/styles";
import { CSSProperties } from "@material-ui/core/styles/withStyles";

const styles = (theme: Theme): { [k: string]: CSSProperties } => ({
  row: {
    height: `20px`
  }
});

export default styles;

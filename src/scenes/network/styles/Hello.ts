import { Theme } from "@material-ui/core/styles";
import { CSSProperties } from "@material-ui/core/styles/withStyles";

const styles = (theme: Theme): { [k: string]: CSSProperties } => ({
  hello: {
    height: `calc(100%)`,
    overflow: "hidden"
  }
});

export default styles;

import * as React from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { purple, green } from "@material-ui/core/colors";
import { MixinsOptions } from "@material-ui/core/styles/createMixins";

export interface IMyMixisOptions extends MixinsOptions {
  windowHeight: number;
}

const mixins: IMyMixisOptions = {
  windowHeight: window.innerHeight
};

// A theme with custom primary and secondary color.
// It's optional.
const theme = createMuiTheme({
  typography: {
    useNextVariants: true
  },
  palette: {
    primary: {
      dark: purple[700],
      light: purple[300],
      main: purple[500]
    },
    secondary: {
      dark: green[700],
      light: green[300],
      main: green[500]
    }
  },
  mixins
});

function withRoot(Component: any) {
  function WithRoot(props: any) {
    // MuiThemeProvider makes the theme available down the React tree
    // thanks to React context.
    return (
      <MuiThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Component {...props} />
      </MuiThemeProvider>
    );
  }

  return WithRoot;
}

export default withRoot;

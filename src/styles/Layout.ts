import { Theme, createStyles } from "@material-ui/core/styles";
import { IMyMixisOptions } from "../withRoot";
import green from "@material-ui/core/colors/green";
import red from "@material-ui/core/colors/red";

const drawerWidth = 240;
const drawerMinWidth = 60;

const styles = (theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1
    },
    rootFull: {
      flexGrow: 1,
      height: "100vh"
    },
    appFrame: {
      height: "100%",
      zIndex: 1,
      overflow: "hidden",
      position: "relative",
      display: "flex",
      width: "100%"
    },
    appBar: {
      backgroundColor: "#00a0df",
      position: "absolute",
      marginLeft: drawerMinWidth,
      width: `calc(100% - ${drawerMinWidth}px)`,
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      })
    },
    appBarShift: {
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen
      })
    },
    "appBarShift-left": {
      marginLeft: drawerWidth
    },
    "appBarShift-right": {
      marginRight: drawerWidth
    },
    menuButton: {
      marginLeft: 12,
      marginRight: 20
    },
    hide: {
      display: "none"
    },
    drawerPaper: {
      backgroundColor: "#191c21",
      color: "#fff",
      position: "relative",
      width: drawerWidth,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      })
    },
    drawerPaperMin: {
      width: drawerMinWidth
    },
    drawerHeader: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      padding: "0 8px",
      ...theme.mixins.toolbar
    },
    content: {
      overflow: "hidden",
      width: "100%",
      flexGrow: 1,
      backgroundColor: theme.palette.background.default,
      // padding: theme.spacing.unit ,
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      })
    },
    drawerContent: {
      height:
        (theme.mixins as IMyMixisOptions).windowHeight - theme.spacing.unit * 8,
      overflow: "auto"
    },
    "content-left": {
      // marginLeft: -(drawerWidth - drawerMinWidth)
    },
    "content-right": {
      marginRight: -(drawerWidth - drawerMinWidth)
    },
    contentShift: {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen
      })
    },
    "contentShift-left": {
      marginLeft: 0
    },
    "contentShift-right": {
      marginRight: 0
    },
    title: {
      flex: 1
    },
    selectLib: {
      display: "flex",
      alignItems: " center",
      color: theme.palette.common.white,
      lineHeight: 1,

      "& > span:first-child": {
        marginRight: theme.spacing.unit
      }
    },
    selectLibItem: {
      minWidth: 200,
      display: "flex"
    },
    selectLibResult: {
      "&:focus": {
        backgroundColor: "transparent"
      }
    },
    logoToolbar: {
      alignItems: "center",
      justifyContent: "flex-end",
      display: "flex",
      padding: "0 16px",
      height: "64px",
      backgroundColor: "#191c21",
      marginRight: theme.spacing.unit * 2
    },
    selectIcon: {
      color: theme.palette.common.white
    },
    bottomMenu: {
      position: "absolute",
      bottom: 0
    },
    appBarShiftNoDrawer: {
      width: "100%"
    },
    appBarNoDrawer: {
      backgroundColor: "#191c21"
    },
    active: {
      position: "absolute",
      fontSize: "12px",
      left: "0",
      bottom: -11,
      display: "flex",
      alignItems: "center"
    },
    activeIcon: {
      marginRight: 4,
      display: "block",
      height: "10px",
      width: "10px",
      borderRadius: "50%"
    },
    activeIconActive: {
      backgroundColor: green[500]
    },
    activeIconInactive: {
      backgroundColor: red[500]
    },
    selectLibStatus: {
      position: "relative"
    },
    libType: {
      color: "#ff8c00",
      fontWeight: 700,
      marginLeft: theme.spacing.unit * 2
    }
  });

export default styles;

import { Theme, createStyles } from "@material-ui/core/styles";
const styles = (theme: Theme) =>
  createStyles({
    wrap: {
      position: "relative",
      height: "100%",
      width: "100%"
    },

    videoControls: {
      position: "absolute",
      bottom: 0,
      width: "100%",
      color: "#fff",
      overflow: "hidden",
      height: 24
    },
    wrapperButton: {
      position: "absolute",
      zIndex: 10,
      color: "black",
      width: "100%",
      top: 0
      // objectFit: "fill"
    },
    controlBtn: {
      height: "100%",
      padding: 0,
      position: "absolute",
      color: "rgba(183,197,205,.66)",
      cursor: "pointer",
      transition: ".3s all ease-in-out",
      "&:hover": {
        color: "#ffffff"
      }
    },
    adsButton: {
      backgroundColor: "#3129278f",
      borderRadius: "40px",
      position: "absolute",
      height: "75px",
      width: "75px",
      right: "10px",
      top: "10px"
    },
    zoomButton: {
      backgroundColor: "#3129278f",
      borderRadius: "40px",
      position: "absolute",
      height: "75px",
      width: "30px",
      left: "10px",
      top: "10px"
    },
    button: {
      fontSize: "40px",
      color: "#ffffff8a"
    },
    in: {
      position: "relative",
      top: "3px",
      left: "3px"
    },
    out: {
      position: "relative",
      top: "48px",
      left: "3px"
    },
    up: {
      position: "relative",
      right: "-26px"
    },
    down: {
      position: "relative",
      top: "52px",
      right: "-26px"
    },
    right: {
      position: "relative",
      top: "27px",
      right: "-50px"
    },
    left: {
      position: "relative",
      top: "27px",
      right: "0px"
    },

    time: {
      height: "100%",
      position: "absolute",
      boxSize: "border-box"
    },

    play: { left: 0, width: 40 },
    sound: { left: 40, width: 40 },
    options: { right: 0, width: 40 },
    resolution: { right: 40, width: 100 },
    buttonImg: {
      height: "66%",
      width: "66%",
      marginTop: "17%",
      marginLeft: "17%"
    },
    fullscreen: {
      right: 0
    },
    volumn: {
      left: 24
    },
    volumnSeekbar: {
      left: 24 * 2,
      width: 50
    },
    seekbar: {
      left: 24 * 2 + 50 + 8,
      width: `calc(100% - ${24 * 2 + 50 + 40}px)`
    },
    loadingWrap: {
      width: 40,
      height: 40,
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)"
    }
  });

export default styles;

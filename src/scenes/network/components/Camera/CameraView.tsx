import * as React from "react";
import * as classNames from "classnames";
import * as moment from "moment";
import * as mapboxgl from "mapbox-gl";
import { throttle } from "lodash-es";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import { Theme, withStyles } from "@material-ui/core/styles";
import { CSSProperties } from "@material-ui/core/styles/withStyles";
import FormControl from "@material-ui/core/FormControl";
import IStyleProps from "src/styles/utils";
import HLSSource from "src/components/video/HLSSource";
import PaginationMUI from "src/components/Pagination/PaginationMUI";
import Player360 from "src/components/Player360";
// import PlayerVideo360 from "src/components/Player360/Video";
// import PLYRSource from "src/components/video/PLYRSource";
import Typography from "@material-ui/core/Typography";
import * as Scrollbars from "react-custom-scrollbars";
import Button from "@material-ui/core/Button";
import Alarm from "@material-ui/icons/Alarm";
import DateRange from "@material-ui/icons/DateRange";
import Left from "@material-ui/icons/KeyboardArrowLeft";
import Right from "@material-ui/icons/KeyboardArrowRight";
import SaveIcon from "@material-ui/icons/Save";

import { DateTimePicker } from "material-ui-pickers";

// import { PlyrEvent } from "react-plyr";
import {
  ICameraView,
  ICamereRecordVideo,
  IRecordVideo,
  ICameraLocation
} from "../../types/CameraView";
import ICmrClipPost from "./ICmrClipPost";
import CreateIncidentClip, { ClipMark } from "./CreateIncidentClip";
import { IIcdClip } from "../Incident/types/IncidentInfo";
import * as _ from "lodash";
// import { VideoUtils } from "../../../../helpers/videoUrlCreator";
import LogsContainer from "../../containers/Camera/LogsContainer";
import AddVideoWallDialog from "../../containers/Camera/AddVideoWallDialog";
import IAuth from "../../../../types/Auth";
import { UserLibRole } from "../../../../helpers/permission";
import { CameraType } from "../../../../types/Camera";

export enum CameraViewScope {
  INCIDENT = "job",
  BOARD = "board"
}

export interface IProps {
  loadCameraView: (pointId: string, isCameraView: boolean) => void;
  role: UserLibRole;
  cameraView: ICameraView;
  pointId: string;
  listRecordVideo: ICamereRecordVideo;
  auth: IAuth;
  cameraLogs: ICameraLocation[];
  searchRecordVideo: (
    pointId: string,
    start?: string,
    end?: string
  ) => (page: number) => void;
  searchRecordVideoWithKeyword: (
    pointId: string,
    start?: string,
    end?: string
  ) => void;
  saveVideo: (pointId: string) => void;
  quickView: (
    pointId: string,
    name: string,
    type: string,
    cameraType: CameraType
  ) => void;
  createIncidentClip?: (clip: ICmrClipPost) => void;
  scope?: CameraViewScope;
  playingClip?: IIcdClip;
  releasePlayingClip?: () => void;
  openAddVideoWall: (cameraId: string) => void;
  loadRecordCameraLogs: (videoId: string) => void;
}
export interface IState {
  video: IRecordVideo;
  search: string;
  page: number;
  start: string;
  end: string;
  isSaveVideo: boolean;
  clip: Partial<ICmrClipPost>;
  currentTime: number;
  sideVideosHeight: number;
  playTime: number;
  playingVideo: IRecordVideo;
  isLoadedMapDataOnce: boolean;
  cameraLogs: ICameraLocation[];
}

const styles = (theme: Theme): { [k: string]: CSSProperties } => ({
  container: {
    display: "flex",
    width: "100%"
  },
  mainCamera: {
    width: "calc(100% - 400px)",
    paddingLeft: "50px",
    paddingTop: "20px"
  },
  video: {
    width: "calc(100% - 50px)",
    height: "auto",
    paddingTop: "7px"
  },
  rightPanel: {
    width: "400px"
  },
  paper: {
    display: "relative"
  },
  margin: {
    margin: theme.spacing.unit
  },
  withoutLabel: {
    marginTop: theme.spacing.unit * 3
  },
  textField: {
    width: "350px",
    marginTop: "10px"
  },
  itemWrapper: {
    display: "flex",
    width: "100%",
    height: "100px",

    "&:not(:first-child)": {
      marginTop: "20px"
    }
  },
  itemClipWrapper: {
    width: "calc(100% - 50px)",
    marginTop: "20px"
  },
  itemImage: {
    display: "flex",
    width: "150px",
    height: "100px"
  },
  itemContent: {
    display: "flex",
    width: "250px",
    height: "100px"
  },
  blackCamera: {
    backgroundColor: "black",
    width: "100%"
  },
  itemContentWrapper: {
    display: "block",
    paddingLeft: "10px"
  },
  titleName: {
    display: "flex",
    width: "calc(100% - 350px)",
    height: "120px"
  },
  titleVideo: {
    display: "flex",
    width: "200px",
    height: "120px"
  },
  recordVideo: {
    display: "flex",
    height: "30px",
    width: "300px"
  },
  quickView: {
    marginLeft: "auto"
  },
  imageWapper: {
    cursor: "pointer",
    width: "100%",

    "&:after": {
      content: "' '",
      display: "block",
      position: "absolute",
      width: "100%",
      backgroundImage: `url(${require("src/assets/images/no-image-icon.png")})`
    }
  },
  pagination: {
    textAlign: "center",
    marginTop: "16px"
  },
  videoPlayer: {
    cursor: "pointer"
  },
  listPreview: {
    marginTop: 40
  },
  addWallDialogButton: {
    display: "flex",
    height: "36px",
    marginLeft: "10px"
  },
  miniMap: {
    display: "flex",
    height: "120px",
    width: "400px",
    marginLeft: "auto"
  },
  miniCamera: {
    display: "flex",
    width: "500px"
  },
  headerCamera: {
    display: "flex",
    width: "calc(100% - 50px)"
  }
});

const EMPTY_VIDEO = {
  videoSrc: "",
  start: 0,
  end: 0,
  id: "",
  name: "",
  createdDateUtc: "",
  videoUrl: "",
  androidVideoUrl: "",
  thumbnailUrl: "",
  duration: "",
  startDateUtc: "",
  endDateUtc: ""
};

class CameraView extends React.Component<IStyleProps & IProps, IState> {
  private mainVideo: React.RefObject<HTMLDivElement> = React.createRef();
  private mapContainer: any;
  private map: mapboxgl.Map;
  public state: IState = {
    video: EMPTY_VIDEO,
    search: "",
    page: 1,
    start: new Date(new Date().setDate(new Date().getDate() - 30))
      .toISOString()
      .substr(0, 16),
    end: new Date().toISOString().substr(0, 16),
    isSaveVideo: false,
    clip: {},
    currentTime: 0,
    sideVideosHeight: 0,
    playTime: 0,
    playingVideo: EMPTY_VIDEO,
    isLoadedMapDataOnce: false,
    cameraLogs: []
  };

  constructor(props: IStyleProps & IProps) {
    super(props);
    this.mapContainer = React.createRef();
    window.addEventListener("resize", this.setSizeSideVideos);
  }

  private clickVideo(video: IRecordVideo) {
    this.setState({
      video,
      clip: {}
    });
    this.props.loadRecordCameraLogs(video.id);
  }

  private handleChangeStart = (event: any) => {
    const { searchRecordVideoWithKeyword, pointId } = this.props;
    this.setState({
      start: event.toISOString(),
      page: 1
    });
    searchRecordVideoWithKeyword(pointId, event.toISOString(), this.state.end);
  };

  private handleChangeEnd = (event: any) => {
    const { searchRecordVideoWithKeyword, pointId } = this.props;
    this.setState({
      end: event.toISOString(),
      page: 1
    });
    searchRecordVideoWithKeyword(
      pointId,
      this.state.start,
      event.toISOString()
    );
  };

  private onLoad = () => {
    this.setSizeSideVideos();
  };

  private setSizeSideVideos = () => {
    if (this.mainVideo.current) {
      this.setState({
        sideVideosHeight: this.mainVideo.current.offsetHeight
      });
    }
  };

  private debounceSendLocation = throttle((lon: number, lat: number) => {
    this.map.setCenter([lon, lat]);
    (this.map.getSource("camPointsVehicle") as mapboxgl.GeoJSONSource).setData({
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [lon, lat]
          },
          properties: {}
        }
      ]
    });
  }, 1000);

  public componentWillUnmount() {
    window.removeEventListener("resize", this.setSizeSideVideos);
  }

  public componentDidMount() {
    const {
      searchRecordVideoWithKeyword,
      listRecordVideo,
      pointId
    } = this.props;
    if (this.mapContainer.current) {
      this.map = new mapboxgl.Map({
        container: this.mapContainer.current,
        style: "/3d_building_style.json",
        center: [139.4927085, -20.7255748],
        zoom: 15
      });
    }
    if (this.props.scope) {
      this.props.loadCameraView(
        pointId,
        this.props.scope === CameraViewScope.BOARD
      );
    } else {
      this.props.loadCameraView(pointId, true);
    }
    if (listRecordVideo.total === 0) {
      searchRecordVideoWithKeyword(pointId);
    }
    if (this.props.playingClip) {
      this.playClip(this.props.playingClip);
    }
  }

  public setupMap() {
    const empty = {
      type: "FeatureCollection",
      features: []
    } as GeoJSON.FeatureCollection;
    this.map.addSource("camPointsVehicle", {
      type: "geojson",
      data: empty
    });
    this.map.addLayer({
      id: "camPointsVehicle",
      type: "circle",
      source: "camPointsVehicle",
      paint: {
        "circle-color": "#359a82",
        "circle-radius": 10
      }
    });
    this.setState({
      isLoadedMapDataOnce: true
    });
  }

  public shouldComponentUpdate(nextProps: IProps, nextState: IState) {
    if (
      this.props.playingClip !== nextProps.playingClip ||
      !_.isEqual(nextProps, this.props)
    ) {
      return true;
    }
    if (
      nextState.currentTime !== this.state.currentTime &&
      this.state.playTime === nextState.playTime
    ) {
      return false;
    }
    return !_.isEqual(nextState, this.state);
  }

  public componentDidUpdate(prevProps: IProps, prevState: IState) {
    if (prevProps.pointId !== this.props.pointId) {
      this.setState({
        clip: {},
        video: EMPTY_VIDEO
      });
    }
    const { playingClip } = this.props;
    if (playingClip !== prevProps.playingClip) {
      if (playingClip) {
        this.playClip(playingClip);
      }
    }
    if (
      this.props.listRecordVideo !== prevProps.listRecordVideo &&
      playingClip
    ) {
      this.playClip(playingClip);
    }
    if (
      this.props.cameraView &&
      this.props.cameraView.pointDeviceType === CameraType.Vehicle &&
      this.state.video &&
      prevState.video &&
      this.state.video.id !== prevState.video.id
    ) {
      this.routeMiniMap(
        this.props.cameraLogs,
        this.state.video.startDateUtc,
        this.state.video.endDateUtc
      );
    }
    if (!this.state.isLoadedMapDataOnce && this.map) {
      this.setupMap();
    }
  }

  private routeMiniMap = (
    data: ICameraLocation[],
    startTime: string,
    endTime: string
  ) => {
    const result: ICameraLocation[] = [];
    const startT = moment.utc(startTime).valueOf() - 60000;
    const endT = moment.utc(endTime).valueOf() - 60000;
    data.forEach(element => {
      if (element.time >= startT && element.time <= endT) {
        result.push({
          ...element,
          time: element.time - startT
        });
      }
    });
    if (result.length > 0) {
      this.map.setCenter([result[0].lon, result[0].lat]);
    }
    this.setState({
      cameraLogs: result
    });
  };

  private playClip = (clip: IIcdClip) => {
    // if (clip.videoRecordId === this.state.playingVideo.id) {
    //   this.seekTo(clip);
    //   return;
    // }
    // const video = this.props.listRecordVideo.recordedVideos.find(recoder => {
    //   return recoder.id === clip.videoRecordId;
    // });

    // if (video) {
    //   this.setState({
    //     video
    //   });
    // } else {
    const duration = moment.duration(clip.endTime - clip.startTime, "seconds");
    const formatted = moment({
      hours: duration.hours(),
      minutes: duration.minutes(),
      seconds: duration.seconds()
    }).format("HH:mm:ss");
    const src = `${clip.videoSrc}?wowzaplaystart=${clip.startTime *
      1000}&wowzaplayduration=${(clip.endTime - clip.startTime) * 1000}`;
    const videoFromClip: IRecordVideo = {
      videoSrc: src,
      id: clip.videoRecordId,
      name: clip.description,
      createdDateUtc: clip.videoStartTimeUtc,
      videoUrl: "",
      androidVideoUrl: "",
      thumbnailUrl: "",
      duration: formatted,
      start: clip.startTime,
      end: clip.endTime,
      startDateUtc: moment
        .utc(clip.videoStartTimeUtc)
        .add(clip.startTime, "seconds")
        .toISOString(),
      endDateUtc: moment
        .utc(clip.videoStartTimeUtc)
        .add(clip.endTime, "seconds")
        .toISOString()
    };

    this.setState({
      video: videoFromClip
    });
    // }
  };
  // private seekTo = (clip: IIcdClip) => {
  //   if (clip.videoRecordId === this.state.video.id) {
  //     this.setState({
  //       playTime: this.state.playTime + 1
  //     });
  //     if (this.props.releasePlayingClip) {
  //       this.props.releasePlayingClip();
  //     }
  //   }
  // };

  // private onPlay = (event: PlyrEvent) => {
  // const { playingClip } = this.props;
  // if (playingClip) {
  //   if (!event.detail.plyr.duration) {
  //     return;
  //   }
  //   this.seekTo(playingClip);
  // }
  // this.setState({
  //   playingVideo: this.state.video
  // });
  // };

  // private onPlay360 = (duration: number) => {
  //   const { playingClip } = this.props;
  //   if (playingClip) {
  //     if (!duration) {
  //       return;
  //     }
  //     this.seekTo(playingClip);
  //   }
  //   this.setState({
  //     playingVideo: this.state.video
  //   });
  // };

  private saveVideo = () => {
    const { pointId, saveVideo } = this.props;
    this.setState({
      isSaveVideo: true
    });
    saveVideo(pointId);
    setTimeout(() => {
      this.setState({
        isSaveVideo: false
      });
    }, 3000);
  };

  private changeClipDescription = (desc: string) => {
    const { clip } = this.state;
    this.setState({
      clip: {
        ...clip,
        description: desc
      }
    });
  };

  private onMark = (mark: ClipMark) => {
    const { clip, currentTime } = this.state;
    switch (mark) {
      case ClipMark.START:
        {
          this.setState({
            clip: {
              ...clip,
              startTime: Math.floor(currentTime),
              endTime:
                (clip.endTime || 0) < currentTime ? undefined : clip.endTime
            }
          });
        }
        break;
      case ClipMark.END:
        {
          this.setState({
            clip: {
              ...clip,
              endTime: Math.ceil(currentTime),
              startTime:
                (clip.startTime || 0) > currentTime ? undefined : clip.startTime
            }
          });
        }
        break;
      case ClipMark.CLEAR:
        {
          this.setState({
            clip: {
              ...clip,
              startTime: undefined,
              endTime: undefined
            }
          });
        }
        break;
    }
  };

  private onPlayerTimeUpdate = (time: number) => {
    const roundTime = Math.round(time);
    const data = this.state.cameraLogs.find(
      el => Math.round(el.time / 1000) === roundTime
    );
    if (data) {
      this.debounceSendLocation(data.lon, data.lat);
    }
    if (this.props.playingClip) {
      return;
    }
    this.setState({
      currentTime: time
    });
  };

  private saveClip = () => {
    const { createIncidentClip } = this.props;
    if (!createIncidentClip) {
      return;
    }
    const { clip } = this.state;
    if (
      !clip.description ||
      clip.startTime === undefined ||
      !clip.endTime ||
      clip.startTime >= clip.endTime
    ) {
      return;
    }

    let { video } = this.state;
    if (
      this.props.listRecordVideo.recordedVideos.length &&
      this.props.createIncidentClip &&
      !video.id
    ) {
      video = this.props.listRecordVideo.recordedVideos[0];
    }

    createIncidentClip({
      incidentId: clip.incidentId || "",
      pointId: this.props.pointId,
      videoRecordId: video.id,
      startTime: clip.startTime,
      endTime: clip.endTime,
      description: clip.description
    });
    this.setState({
      clip: {
        ...clip,
        startTime: undefined,
        endTime: undefined,
        description: undefined
      }
    });
  };

  private errorLoadThumb(e: any) {
    e.target.onerror = null;
    e.target.src = require("src/assets/images/no-image-icon.png");
  }

  public render() {
    const {
      classes,
      cameraView,
      listRecordVideo,
      searchRecordVideo,
      pointId,
      quickView,
      openAddVideoWall,
      role,
      cameraLogs,
      scope = CameraViewScope.BOARD
    } = this.props;
    console.log(cameraLogs);
    const { clip } = this.state;
    let { video } = this.state;
    if (
      this.props.listRecordVideo.recordedVideos.length &&
      scope === CameraViewScope.INCIDENT &&
      !video.id
    ) {
      video = this.props.listRecordVideo.recordedVideos[0];
    }

    const videoItem = (el: IRecordVideo, index: number) => (
      <div
        key={index}
        className={classes.itemWrapper}
        onClick={this.clickVideo.bind(this, el)}
      >
        <div className={classes.itemImage}>
          {el.thumbnailUrl ? (
            <img
              className={classes.imageWapper}
              src={el.thumbnailUrl}
              onError={this.errorLoadThumb}
            />
          ) : (
            <img
              className={classes.imageWapper}
              src={require("src/assets/images/no-image-icon.png")}
            />
          )}
        </div>
        <div className={classes.itemContent}>
          <div className={classes.itemContentWrapper}>
            <Typography variant="subtitle1">Duration: {el.duration}</Typography>
            <Typography variant="subtitle1">
              {moment
                .utc(el.endDateUtc)
                .local()
                .format("DD/MM/YYYY - H:mm:ss")}
            </Typography>
            <Typography variant="subtitle1">
              {moment
                .utc(el.startDateUtc)
                .local()
                .format("DD/MM/YYYY - H:mm:ss")}
            </Typography>
          </div>
        </div>
      </div>
    );

    return (
      <div className={classes.container}>
        <div className={classes.mainCamera}>
          <div className={classes.headerCamera}>
            {cameraView && scope !== CameraViewScope.INCIDENT && (
              <div className={classes.miniCamera}>
                <div
                  className={classes.titleVideo}
                  onClick={this.clickVideo.bind(this, EMPTY_VIDEO)}
                >
                  {video.videoSrc !== "" && (
                    <HLSSource
                      className={classes.videoPlayer}
                      src={cameraView.liveStreamUrl}
                      type="stream"
                      control={[]}
                    />
                  )}
                  {video.videoSrc === "" && (
                    <div className={classes.blackCamera} />
                  )}
                </div>
                <AddVideoWallDialog />
                <div className={classes.addWallDialogButton}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    className={classes.button}
                    onClick={openAddVideoWall.bind(this, cameraView.pointId)}
                  >
                    Add to Video Wall
                  </Button>
                </div>
              </div>
            )}
            {cameraView &&
              cameraView.pointDeviceType === CameraType.Vehicle && (
                <div className={classes.miniMap} ref={this.mapContainer} />
              )}
          </div>
          <div ref={this.mainVideo} className={classes.video}>
            {video.videoSrc !== "" &&
              cameraView &&
              cameraView.pointDeviceType !== CameraType.B360 && (
                <div className={classes.videoPlayer}>
                  <HLSSource
                    onLoad={this.onLoad}
                    className={classes.videoPlayer}
                    src={video.videoSrc}
                    type="stream"
                    onTimeUpdate={this.onPlayerTimeUpdate}
                    currentTime={this.state.currentTime}
                    // onLoadedmetadata={this.onPlay}
                  />
                </div>
              )}
            {video.videoSrc !== "" &&
              cameraView &&
              cameraView.pointDeviceType === CameraType.B360 && (
                <div
                  style={{
                    height: "calc((100vw - 740px) * 0.5625)",
                    width: "100%",
                    position: "relative"
                  }}
                >
                  <Player360
                    src={video.videoSrc}
                    onTimeUpdate={this.onPlayerTimeUpdate}
                    currentTime={this.state.currentTime}
                    // onLoadedmetadata={this.onPlay360}
                  />
                </div>
              )}
            {video.videoSrc === "" &&
              cameraView &&
              cameraView.pointDeviceType !== CameraType.B360 && (
                <div>
                  <HLSSource
                    onLoad={this.onLoad}
                    className={classes.videoPlayer}
                    src={cameraView.liveStreamUrl}
                    type="stream"
                  />
                </div>
              )}
            {video.videoSrc === "" &&
              cameraView &&
              cameraView.pointDeviceType === CameraType.B360 && (
                <div
                  style={{
                    height: "calc((100vw - 740px) * 0.5625)",
                    width: "100%",
                    position: "relative"
                  }}
                >
                  <Player360
                    src={cameraView.liveStreamUrl}
                    disableControl={true}
                  />
                </div>
              )}
          </div>
          {this.props.createIncidentClip &&
            scope === CameraViewScope.INCIDENT &&
            video.videoSrc && (
              <CreateIncidentClip
                currentTime={this.state.currentTime}
                classes={classes}
                startTime={clip.startTime}
                endTime={clip.endTime}
                description={clip.description}
                mark={this.onMark}
                onChangeDescription={this.changeClipDescription}
                handleOK={this.saveClip}
              />
            )}
          <div className={classes.itemWrapper}>
            <div className={classes.titleName}>
              <div className={classes.itemContentWrapper}>
                {video.videoSrc === "" && cameraView && (
                  <div>
                    <Typography variant="h5">
                      {cameraView.cameraName}
                    </Typography>
                    <Typography variant="subtitle1">
                      Address: {cameraView.address}
                    </Typography>
                  </div>
                )}
                {video.videoSrc !== "" && (
                  <div>
                    <Typography variant="h5">{video.name}</Typography>
                    <Typography variant="subtitle1">
                      Duration: {video.duration}
                    </Typography>
                    <Typography variant="subtitle1">
                      Start:{" "}
                      {moment
                        .utc(video.startDateUtc)
                        .local()
                        .format("DD/MM/YYYY - H:mm:ss")}
                    </Typography>
                    <Typography variant="subtitle1">
                      End:{" "}
                      {moment
                        .utc(video.endDateUtc)
                        .local()
                        .format("DD/MM/YYYY - H:mm:ss")}
                    </Typography>
                  </div>
                )}
              </div>
            </div>
            <div className={classes.recordVideo}>
              {cameraView &&
                scope !== CameraViewScope.INCIDENT &&
                video.videoSrc === "" && (
                  <Button
                    variant="outlined"
                    disabled={this.state.isSaveVideo}
                    color="secondary"
                    className={classes.button}
                    onClick={this.saveVideo.bind(this, pointId)}
                  >
                    Record Stream
                  </Button>
                )}
              {cameraView && scope !== CameraViewScope.INCIDENT && (
                <Button
                  variant="outlined"
                  disabled={this.state.isSaveVideo}
                  color="secondary"
                  className={classes.quickView}
                  onClick={quickView.bind(
                    this,
                    this.state.video.videoSrc !== ""
                      ? this.state.video.videoSrc
                      : cameraView.liveStreamUrl,
                    this.state.video.name !== ""
                      ? this.state.video.name
                      : cameraView.cameraName,
                    this.state.video.name !== "" ? "video" : "stream",
                    cameraView.pointDeviceType
                  )}
                >
                  Quick View
                </Button>
              )}
              {scope !== CameraViewScope.INCIDENT && video.videoSrc !== "" && (
                <Button
                  href={video.videoSrc.replace("/video", "/video/download")}
                  variant="outlined"
                  disabled={this.state.isSaveVideo}
                  color="secondary"
                  className={classes.quickView}
                >
                  <SaveIcon
                    className={classNames(classes.leftIcon, classes.iconSmall)}
                  />
                  Download
                </Button>
              )}
            </div>
          </div>
          {scope !== CameraViewScope.INCIDENT &&
            role &&
            [UserLibRole.Admin, UserLibRole.Owner].indexOf(role) >= 0 && (
              <LogsContainer cameraId={this.props.pointId} />
            )}
        </div>
        <div className={classes.rightPanel}>
          <FormControl className={classNames(classes.textField)}>
            <div className="picker">
              {/* <Root /> */}
              <DateTimePicker
                fullWidth={true}
                timeIcon={<Alarm />}
                dateRangeIcon={<DateRange />}
                keyboardIcon={<DateRange />}
                leftArrowIcon={<Left />}
                rightArrowIcon={<Right />}
                keyboard={true}
                label="Start time"
                onError={console.log}
                maxDate={moment.utc(this.state.end).toDate()}
                value={moment.utc(this.state.start).toDate()}
                onChange={this.handleChangeStart}
                format="YYYY/MM/DD hh:mm A"
                mask={[
                  /\d/,
                  /\d/,
                  /\d/,
                  /\d/,
                  "/",
                  /\d/,
                  /\d/,
                  "/",
                  /\d/,
                  /\d/,
                  " ",
                  /\d/,
                  /\d/,
                  ":",
                  /\d/,
                  /\d/,
                  " ",
                  /a|p/i,
                  "M"
                ]}
              />
              <DateTimePicker
                fullWidth={true}
                timeIcon={<Alarm />}
                dateRangeIcon={<DateRange />}
                keyboardIcon={<DateRange />}
                leftArrowIcon={<Left />}
                rightArrowIcon={<Right />}
                keyboard={true}
                label="End time"
                onError={console.log}
                minDate={moment.utc(this.state.start).toDate()}
                value={moment.utc(this.state.end).toDate()}
                onChange={this.handleChangeEnd}
                format="YYYY/MM/DD hh:mm A"
                mask={[
                  /\d/,
                  /\d/,
                  /\d/,
                  /\d/,
                  "/",
                  /\d/,
                  /\d/,
                  "/",
                  /\d/,
                  /\d/,
                  " ",
                  /\d/,
                  /\d/,
                  ":",
                  /\d/,
                  /\d/,
                  " ",
                  /a|p/i,
                  "M"
                ]}
              />
            </div>
          </FormControl>
          {scope === CameraViewScope.INCIDENT ? (
            <Scrollbars.default
              className={classes.listPreview}
              autoHeight={true}
              autoHeightMax={Math.max(this.state.sideVideosHeight, 480)}
            >
              {listRecordVideo.recordedVideos.map(videoItem)}
            </Scrollbars.default>
          ) : (
            listRecordVideo.recordedVideos.map(videoItem)
          )}
          {listRecordVideo.total > 0 && (
            <div className={classes.pagination}>
              <PaginationMUI
                start={this.state.page}
                display={6}
                total={Math.ceil(listRecordVideo.total / 10)}
                onChangePage={searchRecordVideo(
                  pointId,
                  this.state.start,
                  this.state.end
                )}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(CameraView);

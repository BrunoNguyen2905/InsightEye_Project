import * as React from "react";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import InputAdornment from "@material-ui/core/InputAdornment";
import Divider from "@material-ui/core/Divider";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import BackIcon from "@material-ui/icons/ArrowBack";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { FormValidateChildProps, HOCForm } from "react-hoc-form-validatable";
import IStyleProps from "../../../styles/utils";
import InputValidate from "src/components/InputValidate";
import styles from "../styles/formCCTV";
import { CameraType } from "../../../types/Camera";
import SectionLoading from "../../../components/SectionLoading";
import CheckIcon from "@material-ui/icons/Done";
import { IPlan } from "../../lib/types/libs";

interface IProps {
  changeType: (type: CameraType) => void;
  currentType: CameraType;
  currentAddress: string;
  stateCheckVideoUrl: {
    isChecking: boolean;
    success: boolean;
    imageUrl: string;
  };
  onClickBack: () => void;
  onChangeVideoUrl: (url: string) => void;
  onChangeAddress: (add: string) => void;
  onChangePointData: (
    data: {
      startPoint: number[];
      bearing: number;
      angle: number;
      distance: number;
      isPtz: boolean;
    }
  ) => void;
  pointData: {
    lng: number;
    lat: number;
    angle: number;
    distance: number;
    bearing: number;
    isPtz: boolean;
  };
  type: string;
}

interface IState {
  selectTab: number;
}

class FormCCTV extends React.Component<
  IStyleProps & IProps & FormValidateChildProps,
  IState
> {
  public state = {
    selectTab: 0
  };

  private form: React.RefObject<HTMLFormElement>;

  constructor(props: IStyleProps & IProps & FormValidateChildProps) {
    super(props);
    this.form = React.createRef();
  }

  public componentDidMount() {
    this.props.changeType(CameraType.CCTV);
  }

  private onChangeTab = (event: any, value: number) => {
    this.setState({
      selectTab: value
    });
  };

  private submitForm = () => {
    if (this.form.current) {
      this.form.current.dispatchEvent(
        new Event("submit", { cancelable: true })
      );
    }
  };

  private onChangeType = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.props.onChangeVideoUrl("");
    this.props.changeType(parseInt(e.target.value, 10) as CameraType);
  };

  private onChangePoint = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { lat, lng, bearing, angle, distance, isPtz } = this.props.pointData;

    const target = e.target as HTMLInputElement;

    const preData = {
      startPoint: [lng, lat],
      bearing,
      angle,
      distance,
      isPtz
    };

    const val = target.value;

    switch (target.name) {
      case "lng": {
        preData.startPoint = [Number(val), preData.startPoint[1]];
        break;
      }
      case "lat": {
        preData.startPoint = [preData.startPoint[0], Number(val)];
        break;
      }
      case "angle": {
        preData.angle = Number(val) && Number(val) !== 0 ? Number(val) : 1;
        break;
      }
      case "distance": {
        preData.distance = Number(val) || 0;
        break;
      }
      case "bearing": {
        preData.bearing = Number(val) || 0;
        break;
      }
      case "isPtz": {
        preData.isPtz = target.checked || false;
        break;
      }
    }

    this.props.onChangePointData(preData);
  };

  private onChangeVideoUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    this.props.onChangeVideoUrl(target.value);
  };

  private onChangeAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    this.props.onChangeAddress(target.value);
  };

  public render() {
    const {
      classes,
      onClickBack,
      pointData,
      onSubmit,
      submitted,
      stateCheckVideoUrl,
      currentAddress,
      type
    } = this.props;
    return (
      <div className={classes.wrap}>
        <div className={classes.title}>
          <IconButton onClick={onClickBack}>
            <BackIcon />
          </IconButton>
          <Typography variant="h6">Create CCTV</Typography>
          <Button
            disabled={submitted}
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={this.submitForm}
          >
            Submit
          </Button>
        </div>
        <Divider />
        {IPlan[IPlan.PayAsYouGo] === type && (
          <div className={classes.plan}>$15* Per Camera/month</div>
        )}
        <form
          className={classes.form}
          noValidate={true}
          ref={this.form}
          onSubmit={onSubmit}
        >
          <div className={classes.section}>
            <Grid container={true} spacing={16} alignItems="center">
              <Grid
                item={true}
                sm={this.props.currentType === CameraType.CCTV ? 5 : 12}
              >
                <Grid container={true} spacing={8}>
                  <Grid item={true} sm={6}>
                    <TextField
                      disabled={submitted}
                      name="lng"
                      value={pointData.lng}
                      onChange={this.onChangePoint}
                      fullWidth={true}
                      type="number"
                      InputLabelProps={{
                        shrink: true
                      }}
                      margin="normal"
                      required={true}
                      label="Lng"
                    />
                  </Grid>
                  <Grid item={true} sm={6}>
                    <TextField
                      disabled={submitted}
                      name="lat"
                      onChange={this.onChangePoint}
                      value={pointData.lat}
                      fullWidth={true}
                      type="number"
                      margin="normal"
                      required={true}
                      InputLabelProps={{
                        shrink: true
                      }}
                      label="Lat"
                    />
                  </Grid>
                </Grid>
                <Grid container={true} spacing={8}>
                  <Grid item={true} sm={6}>
                    <TextField
                      disabled={submitted}
                      name="angle"
                      onChange={this.onChangePoint}
                      value={pointData.angle}
                      fullWidth={true}
                      type="number"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">°</InputAdornment>
                        )
                      }}
                      margin="normal"
                      required={true}
                      label="FOV"
                      InputLabelProps={{
                        shrink: true
                      }}
                    />
                  </Grid>
                  <Grid item={true} sm={6}>
                    <TextField
                      disabled={submitted}
                      name="bearing"
                      onChange={this.onChangePoint}
                      value={pointData.bearing}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">°</InputAdornment>
                        )
                      }}
                      margin="normal"
                      required={true}
                      InputLabelProps={{
                        shrink: true
                      }}
                      label="Bearing"
                      fullWidth={true}
                    />
                  </Grid>
                </Grid>
                <Grid container={true} spacing={8}>
                  <Grid item={true} sm={7}>
                    <TextField
                      disabled={submitted}
                      name="distance"
                      onChange={this.onChangePoint}
                      value={pointData.distance}
                      fullWidth={true}
                      type="number"
                      margin="normal"
                      label="Length of FOV"
                      InputLabelProps={{
                        shrink: true
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">m</InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                  <Grid item={true} sm={5}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          disabled={submitted}
                          checked={pointData.isPtz}
                          name="isPtz"
                          onChange={this.onChangePoint}
                          value="isPtz"
                          color="primary"
                        />
                      }
                      className={classes.checkBox}
                      label="isPtz"
                    />
                  </Grid>
                </Grid>
              </Grid>
              {this.props.currentType === CameraType.CCTV && (
                <Grid item={true} sm={7}>
                  {stateCheckVideoUrl.isChecking && <SectionLoading />}
                  <div className={classes.cctvPreview}>
                    {stateCheckVideoUrl.success &&
                      stateCheckVideoUrl.imageUrl && (
                        <img
                          className={classes.preview}
                          src={stateCheckVideoUrl.imageUrl}
                          alt="preview"
                        />
                      )}
                  </div>
                </Grid>
              )}
            </Grid>
            <Grid container={true} spacing={8}>
              <Grid item={true} sm={9}>
                <InputValidate
                  rule="notEmpty"
                  name="pointname"
                  margin="normal"
                  required={true}
                  label="Camera name"
                  InputLabelProps={{
                    shrink: true
                  }}
                  fullWidth={true}
                />
              </Grid>
              <Grid item={true} sm={3}>
                <InputValidate
                  onChange={this.onChangeType}
                  fullWidth={true}
                  label="Camera type"
                  name="type"
                  defaultValue={CameraType.CCTV.toString()}
                  select={true}
                  className={classes.textField}
                  SelectProps={{
                    MenuProps: {
                      className: classes.menu
                    }
                  }}
                  margin="normal"
                >
                  <MenuItem value={CameraType.CCTV.toString()}>
                    Fix CCTV
                  </MenuItem>
                  <MenuItem value={CameraType.Vehicle.toString()}>
                    Vehicle
                  </MenuItem>
                  <MenuItem value={CameraType.B360.toString()}>360</MenuItem>
                </InputValidate>
              </Grid>
            </Grid>
            {this.props.currentType === CameraType.CCTV && (
              <InputValidate
                InputProps={{
                  endAdornment: stateCheckVideoUrl.imageUrl && (
                    <InputAdornment
                      position="end"
                      className={classes.successCheckPreview}
                    >
                      <CheckIcon />
                    </InputAdornment>
                  )
                }}
                onChange={this.onChangeVideoUrl}
                rule="notEmpty"
                name="url"
                fullWidth={true}
                margin="normal"
                required={true}
                label="Video URL"
                InputLabelProps={{
                  shrink: true
                }}
              />
            )}
            {this.props.currentType === CameraType.Vehicle && (
              <InputValidate
                rule="notEmpty"
                name="mac"
                fullWidth={true}
                margin="normal"
                required={true}
                label="Mac address"
                InputLabelProps={{
                  shrink: true
                }}
              />
            )}
          </div>
          <Tabs
            onChange={this.onChangeTab}
            className={classes.tabs}
            value={this.state.selectTab}
            scrollable={true}
            scrollButtons="auto"
          >
            <Tab
              label="Info"
              classes={{
                selected: classes.tab,
                root: classes.tab
              }}
            />
            <Tab
              label="Config"
              classes={{
                selected: classes.tab,
                root: classes.tab
              }}
            />
          </Tabs>
          <div className={classes.section} hidden={this.state.selectTab !== 0}>
            <TextField
              onChange={this.onChangeAddress}
              value={currentAddress}
              disabled={submitted}
              name="address"
              multiline={true}
              rows={3}
              margin="normal"
              label="Address"
              InputLabelProps={{
                shrink: true
              }}
              fullWidth={true}
            />
            <InputValidate
              name="heightofcamera"
              InputProps={{
                endAdornment: <InputAdornment position="end">m</InputAdornment>
              }}
              type="number"
              margin="normal"
              label="Height of camera (m)"
              InputLabelProps={{
                shrink: true
              }}
              fullWidth={true}
            />
            <Grid container={true} spacing={16} alignItems="flex-end">
              <Grid item={true}>
                <InputValidate
                  defaultValue={2}
                  name="timetosavevideo"
                  type="number"
                  margin="normal"
                  label="Time to save video"
                  rule="timeToSaveVideo"
                  InputLabelProps={{
                    shrink: true
                  }}
                />
              </Grid>
              <Grid item={true}>
                <InputValidate
                  name="timetosavevideotype"
                  defaultValue="day"
                  select={true}
                  className={classes.textField}
                  rule="timeToSaveVideoType"
                  SelectProps={{
                    MenuProps: {
                      className: classes.menu
                    }
                  }}
                  margin="normal"
                >
                  <MenuItem value="day">Day</MenuItem>
                  <MenuItem value="week">Week</MenuItem>
                  <MenuItem value="month">Month</MenuItem>
                </InputValidate>
              </Grid>
            </Grid>
          </div>
          <div className={classes.section} hidden={this.state.selectTab !== 1}>
            <InputValidate
              name="businessname"
              margin="normal"
              label="Business name"
              InputLabelProps={{
                shrink: true
              }}
              fullWidth={true}
            />
            <InputValidate
              name="ownername"
              margin="normal"
              label="Owner name"
              InputLabelProps={{
                shrink: true
              }}
              fullWidth={true}
            />
            <InputValidate
              name="contactphonenumber"
              margin="normal"
              label="Phone number"
              InputLabelProps={{
                shrink: true
              }}
              fullWidth={true}
            />
          </div>
        </form>
      </div>
    );
  }
}
export default withStyles(styles)(HOCForm<IStyleProps & IProps>(FormCCTV));

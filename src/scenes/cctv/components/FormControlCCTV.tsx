import * as React from "react";
import axios, { AxiosResponse, Canceler } from "axios";
import IStyleProps from "src/styles/utils";
import FormCreate from "./FormCCTV";
import FormEdit from "./FormEditCCTV";
import { defaultRules, InputStates } from "react-hoc-form-validatable";
import { ICreateCCTVData, IEditCCTVData } from "../actions/formCCTV";
import { IDetailCCTV } from "../types/listCCTV";
import { REACT_APP_API_URL } from "../../../environment";
import { debounce } from "lodash-es";
import { ILibsStore } from "../../lib/types";
import { CameraType } from "../../../types/Camera";
import SectionLoading from "../../../components/SectionLoading";

interface IProps {
  libs: ILibsStore;
  pointDataAddress: string;
  createCCTV: (
    data: ICreateCCTVData,
    meta?: {
      cb: (success: boolean) => void;
    }
  ) => void;
  editCCTV: (
    data: IEditCCTVData,
    meta?: {
      cb: (success: boolean) => void;
    }
  ) => void;
  detailCCTV: IDetailCCTV | null;
  isLoadingDetailCCTV: boolean;
  isOpenCreate: boolean;
  isOpenEdit: boolean;
  onClickBack: () => void;
  onChangePointData: (
    data: {
      startPoint: number[];
      bearing: number;
      angle: number;
      distance: number;
      isPtz: boolean;
    }
  ) => void;
  onChangePointType: (type: CameraType) => void;
  pointData?: {
    lng: number;
    lat: number;
    angle: number;
    distance: number;
    bearing: number;
    coverage: number[][][];
    isPtz: boolean;
  };
  createPointData: (
    data?: {
      startPoint: number[];
      bearing: number;
      angle: number;
      distance: number;
      isPtz: boolean;
    }
  ) => void;
  type: string;
}

interface IStates {
  currentType: CameraType;
  canChangeAddress: boolean;
  isLoadedGeo: boolean;
  isLoadedDetail: boolean;
  currentAddress: string;
  isSetHiddenCamera?: boolean;
  stateCheckingRtsp: {
    isChecking: boolean;
    success: boolean;
    imageUrl: string;
  };
}

class FormControlCCTV extends React.Component<IProps, IStates> {
  private cancelerCheckRtsp: Canceler;
  private debounceCallCheckRtsp = debounce((cb: () => void) => {
    cb();
  }, 250);

  private ismounted: boolean = true;

  constructor(props: IProps) {
    super(props);
    this.state = {
      currentType: CameraType.CCTV,
      canChangeAddress: false,
      isSetHiddenCamera: undefined,
      isLoadedGeo: false,
      isLoadedDetail: false,
      currentAddress: "",
      stateCheckingRtsp: {
        isChecking: false,
        success: false,
        imageUrl: ""
      }
    };
  }

  private changeType = (type: CameraType) => {
    this.setState({
      currentType: type
    });
    this.props.onChangePointType(type);
  };

  private onChangeSetHiddenCamera = (set: boolean) => {
    this.setState({
      isSetHiddenCamera: !set
    });
  };

  private createSubmit = (
    inputs: {
      [k: string]: InputStates;
    },
    finish: (reset?: boolean) => void
  ) => {
    const {
      businessname,
      contactphonenumber,
      heightofcamera,
      ownername,
      pointname,
      timetosavevideo,
      timetosavevideotype,
      url,
      type,
      mac
    } = inputs;
    if (this.props.pointData) {
      const typeCam = parseInt(type.value, 10) as CameraType;
      this.props.createCCTV(
        {
          hidden: false,
          longitude: this.props.pointData.lng,
          latitude: this.props.pointData.lat,
          bearing: this.props.pointData.bearing,
          fieldOfView: this.props.pointData.angle,
          lengthOfFOV: this.props.pointData.distance,
          coveragePolygonJsonString: JSON.stringify(
            this.props.pointData.coverage
          ),
          address: this.state.currentAddress,
          businessName: businessname.value,
          contactPhoneNumber: contactphonenumber.value,
          heightOfCamera: heightofcamera.value,
          ownerName: ownername.value,
          pointName: pointname.value,
          timeToSaveVideo: timetosavevideo.value,
          timeToSaveVideoType: timetosavevideotype.value,
          cctvUrl: typeCam === CameraType.CCTV ? url.value : "rtmp://xxx",
          isDrone: false,
          altitude: 0,
          isPtz: this.props.pointData.isPtz,
          pointDeviceType: typeCam,
          vehicleMacAddress: mac && mac.value ? mac.value : ""
        },
        {
          cb: (success: boolean) => {
            this.changeType(CameraType.CCTV);
            finish(success);
          }
        }
      );
    }
  };

  private editSubmit = (
    inputs: {
      [k: string]: InputStates;
    },
    finish: (reset?: boolean) => void
  ) => {
    const {
      businessname,
      contactphonenumber,
      heightofcamera,
      ownername,
      pointname,
      timetosavevideo,
      timetosavevideotype,
      url,
      type,
      mac
    } = inputs;
    if (this.props.pointData) {
      const typeCam = parseInt(type.value, 10) as CameraType;
      this.props.editCCTV(
        {
          hidden: Boolean(this.state.isSetHiddenCamera),
          longitude: this.props.pointData.lng,
          latitude: this.props.pointData.lat,
          bearing: this.props.pointData.bearing,
          fieldOfView: this.props.pointData.angle,
          lengthOfFOV: this.props.pointData.distance,
          coveragePolygonJsonString: JSON.stringify(
            this.props.pointData.coverage
          ),
          address: this.state.currentAddress,
          businessName: businessname.value,
          contactPhoneNumber: contactphonenumber.value,
          heightOfCamera: heightofcamera.value,
          ownerName: ownername.value,
          pointName: pointname.value,
          timeToSaveVideo: timetosavevideo.value,
          timeToSaveVideoType: timetosavevideotype.value,
          cctvUrl:
            typeCam === CameraType.CCTV && url && url.value ? url.value : "",
          isDrone: false,
          altitude: 0,
          isPtz: this.props.pointData.isPtz,
          pointDeviceType: typeCam,
          vehicleMacAddress: mac && mac.value ? mac.value : ""
        },
        {
          cb: (success: boolean) => {
            finish(false);
          }
        }
      );
    }
  };

  private onChangeAddress = (add: string) => {
    this.setState({
      currentAddress: add
    });
  };

  private onChangeVideoUrl = (url: string) => {
    const { libs } = this.props;
    if (url) {
      this.debounceCallCheckRtsp(() => {
        this.setState({
          stateCheckingRtsp: {
            ...this.state.stateCheckingRtsp,
            isChecking: true,
            success: false,
            imageUrl: ""
          }
        });
        if (this.cancelerCheckRtsp) {
          this.cancelerCheckRtsp();
        }
        axios
          .post(
            `${REACT_APP_API_URL}/api/v2/point/${libs.selectedLib}/checkrtsp`,
            {
              rtspUrl: url
            },
            {
              cancelToken: new axios.CancelToken(c => {
                this.cancelerCheckRtsp = c;
              })
            }
          )
          .then(
            (data: AxiosResponse<{ success: boolean; imageUrl: string }>) => {
              if (this.ismounted) {
                this.setState({
                  stateCheckingRtsp: {
                    ...this.state.stateCheckingRtsp,
                    isChecking: false,
                    success: data.data.success,
                    imageUrl: data.data.imageUrl
                  }
                });
              }
            }
          )
          .catch(error => {
            if (!axios.isCancel(error)) {
              console.error(error);
              if (this.ismounted) {
                this.setState({
                  stateCheckingRtsp: {
                    ...this.state.stateCheckingRtsp,
                    isChecking: false
                  }
                });
              }
            }
          });
      });
    } else {
      if (this.cancelerCheckRtsp) {
        this.cancelerCheckRtsp();
      }
      this.setState({
        stateCheckingRtsp: {
          isChecking: false,
          success: false,
          imageUrl: ""
        }
      });
    }
  };

  public componentWillReceiveProps(nextProps: IStyleProps & IProps) {
    if (
      nextProps.pointDataAddress &&
      this.props.pointDataAddress !== nextProps.pointDataAddress
    ) {
      if (this.props.isOpenCreate) {
        this.setState({
          currentAddress: nextProps.pointDataAddress
        });
      } else {
        if (this.state.canChangeAddress && this.state.isLoadedDetail) {
          this.setState({
            currentAddress: nextProps.pointDataAddress
          });
        }

        if (this.state.isLoadedDetail && !this.state.canChangeAddress) {
          this.setState({
            isLoadedGeo: true,
            canChangeAddress: true
          });
        }
      }
    }

    if (!this.props.detailCCTV && nextProps.detailCCTV) {
      this.props.onChangePointType(nextProps.detailCCTV.pointDeviceType);
      this.setState({
        isLoadedDetail: true,
        canChangeAddress: this.state.isLoadedGeo,
        currentAddress: nextProps.detailCCTV.address,
        isSetHiddenCamera: nextProps.detailCCTV.hidden
      });
      const {
        longitude,
        latitude,
        bearing,
        fieldOfViewAngle,
        fieldOfViewlength,
        isPtz
      } = nextProps.detailCCTV;
      this.props.createPointData({
        startPoint: [longitude, latitude],
        bearing,
        distance: fieldOfViewlength,
        angle: fieldOfViewAngle,
        isPtz
      });
    }

    if (
      (nextProps.isOpenCreate && !this.props.isOpenCreate) ||
      (nextProps.isOpenEdit && !this.props.isOpenEdit)
    ) {
      if (this.cancelerCheckRtsp) {
        this.cancelerCheckRtsp();
      }
      this.setState({
        stateCheckingRtsp: {
          isChecking: false,
          success: false,
          imageUrl: ""
        }
      });
    }
  }

  public componentWillUnmount() {
    this.ismounted = false;
  }

  public render() {
    const {
      pointData,
      onChangePointData,
      onClickBack,
      isOpenCreate,
      isOpenEdit,
      isLoadingDetailCCTV,
      detailCCTV,
      type,
      libs
    } = this.props;
    const currentLib = libs.list.find(f => f.id === libs.selectedLib);
    const customRule = {
      ...defaultRules,
      timeToSaveVideo: {
        rule(
          value: number,
          params: any,
          input: any,
          allInputs: any,
          formControl: any
        ) {
          console.log(formControl);
          if (currentLib && currentLib.type === "FreeTrial") {
            if (allInputs.timetosavevideotype.value === "week") {
              return value < 3;
            }
            if (allInputs.timetosavevideotype.value === "day") {
              return value < 15;
            }
            return true;
          }
          return true;
        },

        message: {
          error(value: number) {
            if (value > 15) {
              return "Can't set time to save video more than 10 days";
            }
            return "Can't set time to save video more than 2 weeks";
          }
        }
      },
      timeToSaveVideoType: {
        rule(
          value: any,
          params: any,
          input: any,
          allInputs: any,
          formControl: any
        ) {
          if (currentLib && currentLib.type === "FreeTrial") {
            if (
              allInputs.timetosavevideo &&
              parseInt(allInputs.timetosavevideo.value, 0) > 2
            ) {
              return value !== "week" && value !== "month";
            }
            return value !== "month";
          }
          return true;
        },

        message: {
          error: "Can't set time to save video more than 2 weeks"
        }
      }
    };

    return (
      <>
        {isLoadingDetailCCTV && isOpenEdit && <SectionLoading />}
        {isOpenEdit && detailCCTV && (
          <FormEdit
            currentAddress={this.state.currentAddress}
            stateCheckVideoUrl={this.state.stateCheckingRtsp}
            onChangeVideoUrl={this.onChangeVideoUrl}
            onChangeAddress={this.onChangeAddress}
            onChangeSetHidden={this.onChangeSetHiddenCamera}
            isHidden={this.state.isSetHiddenCamera}
            data={detailCCTV}
            isLoading={isLoadingDetailCCTV}
            submitCallback={this.editSubmit}
            validateLang="en"
            rules={customRule}
            onChangePointData={onChangePointData}
            pointData={pointData}
            onClickBack={onClickBack}
          />
        )}
        {pointData && isOpenCreate && (
          <FormCreate
            type={type}
            changeType={this.changeType}
            currentType={this.state.currentType}
            currentAddress={this.state.currentAddress}
            stateCheckVideoUrl={this.state.stateCheckingRtsp}
            onChangeVideoUrl={this.onChangeVideoUrl}
            onChangeAddress={this.onChangeAddress}
            submitCallback={this.createSubmit}
            validateLang="en"
            rules={customRule}
            onChangePointData={onChangePointData}
            pointData={pointData}
            onClickBack={onClickBack}
          />
        )}
      </>
    );
  }
}

export default FormControlCCTV;

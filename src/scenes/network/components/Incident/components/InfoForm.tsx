import * as React from "react";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import { HOCForm, FormValidateChildProps } from "react-hoc-form-validatable";
import InputValidate from "src/components/InputValidate";
import IStyleProps from "src/styles/utils";
import styles from "../styles/InfoForm";
import { SAVE_STATUS } from "../types";
import { DateTimePicker } from "material-ui-pickers";
import { IIncidentSubmitInfo } from "../containers/InfoForm";
import UserSelect from "src/components/AutoComplete/UserSelect";
import { IIncidentForm } from "../types/IncidentInfo";
import { Moment } from "moment";

export interface IInfoFormProps {
  formData: IIncidentForm;
  saveStatus: SAVE_STATUS;
}

export interface IInfoFormDispatchs {
  submitCallback: (info: IIncidentSubmitInfo) => void;
  onChangeData: (formData: IIncidentForm) => void;
}

interface IState {
  selectTab: number;
}

type IProps = IInfoFormProps & IInfoFormDispatchs;

class InfoForm extends React.Component<
  IStyleProps & IProps & FormValidateChildProps,
  IState
> {
  private form: React.RefObject<HTMLFormElement>;

  constructor(props: IStyleProps & IProps & FormValidateChildProps) {
    super(props);
    this.form = React.createRef();
  }

  private submitForm = () => {
    if (this.form.current) {
      this.form.current.dispatchEvent(
        new Event("submit", { cancelable: true })
      );
    }
  };

  private nameChange = (nameObject: any) => {
    this.props.onChangeData({
      ...this.props.formData,
      name: nameObject.target.value
    });
  };

  private onChangeShareIds = (shareIds: string[]) => {
    this.props.onChangeData({
      ...this.props.formData,
      shareUserIds: shareIds
    });
  };
  private onChangeIncidentDate = (time: Moment) => {
    this.props.onChangeData({
      ...this.props.formData,
      incidentDateTimeUtc: time.toISOString()
    });
  };
  private noteChange = (nameObject: any) => {
    this.props.onChangeData({
      ...this.props.formData,
      note: nameObject.target.value
    });
  };

  public render() {
    const { classes, onSubmit, formData, submitted, saveStatus } = this.props;
    let saved;
    switch (saveStatus) {
      case SAVE_STATUS.SAVED:
        {
          saved = (
            <Typography
              variant="subtitle1"
              color="secondary"
              className={classes.saveStatus}
            >
              Saved
            </Typography>
          );
        }
        break;
      case SAVE_STATUS.ERROR:
        {
          saved = (
            <Typography
              variant="subtitle1"
              color="error"
              className={classes.saveStatus}
            >
              Save error
            </Typography>
          );
        }
        break;
      case SAVE_STATUS.UNSAVED:
        saved = (
          <Typography
            variant="subtitle1"
            color="primary"
            className={classes.saveStatus}
          >
            Unsaved
          </Typography>
        );
    }
    const changeShare = (value: string) => {
      this.onChangeShareIds(value.split(","));
    };
    return (
      <div className={classes.wrap}>
        <div className={classes.title}>
          <Typography variant="h6">Job Info</Typography>
          {saved}
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
        <form
          className={classes.form}
          noValidate={true}
          ref={this.form}
          onSubmit={onSubmit}
        >
          <div className={classes.section}>
            <InputValidate
              defaultValue={formData.name}
              onChange={this.nameChange}
              rule="notEmpty"
              name="name"
              margin="normal"
              required={true}
              label="Job name"
              InputLabelProps={{
                shrink: true
              }}
              fullWidth={true}
            />
            <DateTimePicker
              format="DD/MM/YYYY - H:mm:ss"
              name="incidentDateTimeUtc"
              onChange={this.onChangeIncidentDate}
              value={
                formData.incidentDateTimeUtc
                  ? new Date(formData.incidentDateTimeUtc)
                  : new Date()
              }
              label="Job Date"
              fullWidth={true}
            />

            <InputValidate
              name="address"
              multiline={true}
              rows={2}
              margin="normal"
              label="Address"
              InputLabelProps={{
                shrink: true
              }}
              fullWidth={true}
              defaultValue={formData.address}
              rule="notEmpty"
            />

            <UserSelect
              label="Share to other"
              name="share"
              onChange={changeShare}
              value={formData.shareUserIds || []}
              multi={true}
              placeholder="Select user to share"
            />
            <InputValidate
              defaultValue={formData.note}
              onChange={this.noteChange}
              name="note"
              multiline={true}
              rows={2}
              margin="normal"
              label="Note"
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
export default withStyles(styles)(HOCForm<IStyleProps & IProps>(InfoForm));

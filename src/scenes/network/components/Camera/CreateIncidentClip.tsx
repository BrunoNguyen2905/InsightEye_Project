import * as React from "react";
import Button, { ButtonProps } from "@material-ui/core/Button";
import IStyleProps from "src/styles/utils";
import { Typography } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";

const paddingLeft = (num: number) => {
  if (num < 10) {
    return `0${num}`;
  }
  return `${num}`;
};

const toHHMMSS = (secNum: number) => {
  const hours = Math.floor(secNum / 3600);
  const minutes = Math.floor((secNum - hours * 3600) / 60);
  const seconds = secNum - hours * 3600 - minutes * 60;

  return (
    paddingLeft(hours) + ":" + paddingLeft(minutes) + ":" + paddingLeft(seconds)
  );
};

export enum ClipMark {
  START,
  END,
  CLEAR
}

interface IClipProps {
  startTime?: number;
  currentTime: number;
  endTime?: number;
  description?: string;
}
interface IClipDispatchs {
  mark: (mark: ClipMark) => void;
  onChangeDescription: (desc: string) => void;
  handleOK: () => void;
}

const onMark = (mark: ClipMark) => (
  markCallback: (mark: ClipMark) => void
) => () => markCallback(mark);

const ClipTimeLabel = ({ classes, text }: { text: string } & IStyleProps) => (
  <Typography variant="body1">{text}</Typography>
);

const changeDescription = (callback: (value: string) => void) => (event: any) =>
  callback(event.target.value);

const ClipButton = ({
  classes,
  onClick,
  text,
  ...props
}: { text: string } & IStyleProps & ButtonProps) => (
  <Button
    variant="outlined"
    color="secondary"
    className={classes.button}
    onClick={onClick}
    {...props}
  >
    {text}
  </Button>
);

const timeFormat = (time: number) => toHHMMSS(time);

// const canEnd = (current: number, start?: number) => {
//   if (start === undefined) {
//     return false;
//   }
//   if (start >= current) {
//     return false;
//   }
//   return true;
// };

const canSave = ({
  startTime,
  endTime,
  description
}: {
  startTime?: number;
  endTime?: number;
  description?: string;
}) => startTime !== undefined && endTime && description;

const CreateIncidentClip = ({
  classes,
  startTime,
  endTime,
  currentTime,
  description,
  mark,
  onChangeDescription,
  handleOK
}: IClipProps & IClipDispatchs & IStyleProps) => (
  <div className={classes.itemClipWrapper}>
    <Grid container={true} spacing={24}>
      <Grid item={true} sm={3}>
        <ClipButton
          classes={classes}
          onClick={onMark(ClipMark.START)(mark)}
          text={startTime === undefined ? "Mark as Start" : "Remark as Start"}
        />
      </Grid>
      <Grid item={true} sm={3}>
        <ClipButton
          classes={classes}
          onClick={onMark(ClipMark.END)(mark)}
          text={!endTime ? "Mark as End" : "Remark as End"}
        />
      </Grid>
      <Grid item={true} sm={2}>
        <ClipTimeLabel
          classes={classes}
          text={`Start: ${
            startTime !== undefined ? timeFormat(startTime) : "Not set"
          }`}
        />
      </Grid>
      <Grid item={true} sm={2}>
        <ClipTimeLabel
          classes={classes}
          text={`End: ${endTime ? timeFormat(endTime) : "Not set"}`}
        />
      </Grid>
      <Grid item={true} sm={2}>
        <ClipButton
          classes={classes}
          onClick={onMark(ClipMark.CLEAR)(mark)}
          text="Clear"
          disabled={!(startTime !== undefined || endTime !== undefined)}
        />
      </Grid>
    </Grid>
    <Grid container={true} spacing={24}>
      <Grid item={true} sm={10}>
        <TextField
          autoFocus={true}
          id="multiline-flexible"
          label="Description"
          multiline={true}
          rowsMax="4"
          value={description || ""}
          onChange={changeDescription(onChangeDescription)}
          margin="none"
          fullWidth={true}
        />
      </Grid>
      <Grid item={true} sm={2}>
        <ClipButton
          classes={classes}
          onClick={handleOK}
          text="Save"
          disabled={!canSave({ startTime, endTime, description })}
        />
      </Grid>
    </Grid>
  </div>
);

export default CreateIncidentClip;

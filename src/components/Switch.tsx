import { SwitchProps, Switch as RouterSwitch } from "react-router";
import { connect } from "react-redux";
import { IStoreState } from "../types";

const Switch = connect<SwitchProps>(({ routing }: IStoreState) => ({
  location: routing.location || undefined
}))(RouterSwitch);

export default Switch;

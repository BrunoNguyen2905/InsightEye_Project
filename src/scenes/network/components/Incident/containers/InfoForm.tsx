import { connect, Dispatch } from "react-redux";
import { IStoreState } from "src/types";
import * as actions from "../actions";
import InfoForm from "../components/InfoForm";
import { defaultRules } from "react-hoc-form-validatable";
import { NEW_KEY, mappingDispatch } from "../../../../../helpers/mappingRedux";
import { updateTab } from "src/components/TabRoute/actions";
import { IUpdateTab } from "../../../../../components/TabRoute/actions/index";
import paths from "src/paths";
import { IIncidentForm } from "../types/IncidentInfo";

export interface IIcdInfoFormProps {
  id?: string;
  formData: IIncidentForm;
  submitCallback: (info: IIncidentSubmitInfo) => void;
}
export interface IIncidentSubmitInfo {
  address: { value: string };
  name: { value: string };
  note: { value: string };
  share: { value: string[] };
  incidentDateTimeUtc: { value: Date };
}

export function mapStateToProps(
  { mainMap: { incident } }: IStoreState,
  { id = NEW_KEY }: IIcdInfoFormProps
) {
  const data = incident.data[id];
  return {
    saveStatus: incident.saveStatus[id].saveStatus,
    validateLang: "en",
    rules: defaultRules,
    formData: {
      name: data.name,
      note: data.note,
      shareUserIds: data.shares,
      incidentDateTimeUtc: data.incidentDateTimeUtc,
      address: data.address
    }
  };
}

export function mapDispatchToProps(
  dispatch: Dispatch<
    | actions.IIncidentChangeTab
    | actions.IIncidentMapRouteChange
    | actions.IIncidentToggleCam
    | actions.IIncidentSaveData
    | actions.IIncidentUpateData
    | IUpdateTab
  >,
  props: IIcdInfoFormProps
) {
  const dispatchMapper = mappingDispatch(dispatch, props.id || NEW_KEY);
  const tabKey =
    !props.id || props.id === NEW_KEY
      ? paths.incident
      : paths.incidentDetail.replace(":id", props.id);
  return {
    onChangeData: (formData: IIncidentForm) => {
      actions.incidentUpdateData(dispatchMapper)({
        shares: formData.shareUserIds,
        name: formData.name,
        note: formData.note,
        incidentDateTimeUtc: formData.incidentDateTimeUtc
      });
      updateTab(dispatch)("networkRoutes", {
        id: tabKey,
        name: `Job: ${formData.name}`,
        isAlways: false
      });
    },
    submitCallback: (info: IIncidentSubmitInfo) => {
      props.submitCallback(info);
    }
  };
}

export default (connect(
  mapStateToProps,
  mapDispatchToProps
) as any)(InfoForm);

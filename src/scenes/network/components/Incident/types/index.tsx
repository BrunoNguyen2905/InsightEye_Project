import IIncidentTransferData from "./IncidentTransferData";
import { IMappingType } from "../../../../../helpers/mappingRedux";
import { IIcdClip, IIncidentPostInfo } from "./IncidentInfo";

export enum SAVE_STATUS {
  NOT_CHANGED,
  UNSAVED,
  SAVED,
  ERROR
}

export default interface IIncident {
  currentTab: IMappingType<number>;
  showRoute: IMappingType<boolean>;
  inactives: IMappingType<{ [key: string]: boolean }>;
  data: IMappingType<IIncidentTransferData>;
  saveStatus: IMappingType<{
    saveStatus: SAVE_STATUS;
    data?: IIncidentPostInfo;
  }>;
  playingClip: IMappingType<IIcdClip>;
}

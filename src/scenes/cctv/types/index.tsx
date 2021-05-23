import { ICCTV, IListCCTVState, IDetailCCTVState } from "./listCCTV";

export interface IStoreCCTVManagement {
  listCTTV: ICCTV[];
  listState: IListCCTVState;
  detailCCTVState: IDetailCCTVState;
}

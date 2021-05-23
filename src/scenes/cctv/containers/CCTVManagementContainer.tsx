import { connect } from "react-redux";
import Mapbox from "../components/MapBox";
import { IStoreState } from "../../../types";

function mapStateToProps({ CCTVManagement, libs }: IStoreState) {
  return {
    selectedLib: libs.list.find(f => f.id === libs.selectedLib),
    totalCCTV: CCTVManagement.listState.total
    // selectedLibDetail: libs.list.find(f => f.id === libs.selectedLib)
  };
}

// function mapDispatchToProps(dispatch: Dispatch) {
//   return {
//     createCCTV: (
//       data: ICreateCCTVData,
//       meta?: {
//         cb: () => {};
//       }
//     ) => {
//       dispatch(createCCTV(data, meta));
//     }
//   };
// }

export default connect(
  mapStateToProps,
  null
)(Mapbox);

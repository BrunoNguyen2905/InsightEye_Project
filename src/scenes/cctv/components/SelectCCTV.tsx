import * as React from "react";
import { withStyles, Theme } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import AddIcon from "@material-ui/icons/Add";
import LocationIcon from "@material-ui/icons/LocationOn";
import EditIcon from "@material-ui/icons/Edit";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import Divider from "@material-ui/core/Divider";
import IStyleProps from "src/styles/utils";
import Pagination from "src/components/Pagination";
import SectionLoading from "src/components/SectionLoading";
import NotFoundCamera from "src/components/NotFoundCamera";
import { ICCTV } from "../types/listCCTV";
import { CSSProperties } from "@material-ui/core/styles/withStyles";
import { CameraType } from "../../../types/Camera";

const styles = (theme: Theme): { [k: string]: CSSProperties } => ({
  search: {
    display: "flex",
    alignItems: "center",
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    paddingTop: theme.spacing.unit * 2
  },
  searchInput: {
    flexGrow: 1
  },
  list: {
    maxHeight: "calc(100% - 142px)",
    overflow: "auto",
    paddingTop: 0
  },
  listItem: {},
  address: {
    "&  svg": {
      fontSize: 12
    }
  },
  pagination: {
    textAlign: "center",
    marginTop: theme.spacing.unit
  }
});

interface IPointDataPreview {
  type: CameraType;
  startPoint: number[];
  coverage: number[][][];
  bearing: number;
  isPtz: boolean;
  lengthOfFOV: number;
}

interface Iprops {
  selectLib: string;
  isLoading: boolean;
  isFailed: boolean;
  listCCTV: ICCTV[];
  totalCCTV: number;
  getList: () => void;
  onClickCreate: () => void;
  onClickEdit: () => void;
  onChangePage: (current: number, skip: number, keyword: string) => () => void;
  onClickRow: (data: IPointDataPreview) => void;
  onChangeSearchKeyword: (keyword: string) => void;
  getDetailCCTV: (pointid: string) => void;
  pagingCCTV: {
    skip: number;
    current: number;
  };
  searchKeyword: string;
}

function changeKeyword(cb: (keyword: string) => void) {
  return (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    cb(target.value);
  };
}
function onClickEditHandler(
  pointid: string,
  getDetail: (pointid: string) => void,
  cb: () => void
) {
  return (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    cb();
    getDetail(pointid);
  };
}

function onClickRowHandler(
  id: string,
  listCCTV: ICCTV[],
  cb: (data: IPointDataPreview) => void
) {
  return (e: React.MouseEvent<HTMLElement>) => {
    const cctv = listCCTV.find((c: ICCTV) => {
      return c.pointId === id;
    });
    if (cctv) {
      cb({
        type: cctv.pointDeviceType,
        bearing: cctv.bearing,
        startPoint: [cctv.lon, cctv.lat],
        coverage: cctv.coverage,
        isPtz: cctv.isPtz,
        lengthOfFOV: cctv.lengthOfFOV
      });
    }
  };
}

class SelectCCTV extends React.Component<Iprops & IStyleProps> {
  public componentDidMount() {
    this.props.onChangeSearchKeyword("");
    this.props.getList();
  }

  public componentDidUpdate(prevProps: Iprops) {
    if (prevProps.selectLib !== this.props.selectLib) {
      this.props.onChangeSearchKeyword("");
      this.props.getList();
    }
  }

  public render() {
    const {
      classes,
      onChangeSearchKeyword,
      onClickCreate,
      onClickEdit,
      onChangePage,
      isLoading,
      listCCTV,
      totalCCTV,
      isFailed,
      pagingCCTV,
      searchKeyword,
      onClickRow,
      getDetailCCTV
    } = this.props;
    return (
      <>
        <div className={classes.search}>
          <TextField
            onChange={changeKeyword(onChangeSearchKeyword)}
            value={searchKeyword}
            className={classes.searchInput}
            placeholder="Type keyword for searching CCTV"
          />
          <IconButton onClick={onClickCreate} color="primary">
            <AddIcon />
          </IconButton>
        </div>
        {!isLoading && totalCCTV === 0 && <NotFoundCamera />}
        {isLoading && <SectionLoading />}
        {!isLoading &&
          !isFailed && (
            <>
              <List component="nav" className={classes.list}>
                {listCCTV &&
                  listCCTV.map(cctv => (
                    <div key={cctv.pointId}>
                      <ListItem
                        button={true}
                        className={classes.listItem}
                        onClick={onClickRowHandler(
                          cctv.pointId,
                          listCCTV,
                          onClickRow
                        )}
                      >
                        <ListItemText
                          primary={cctv.pointName}
                          secondary={
                            <span className={classes.address}>
                              <LocationIcon /> {cctv.address}
                            </span>
                          }
                        />
                        <div>
                          <IconButton
                            onClick={onClickEditHandler(
                              cctv.pointId,
                              getDetailCCTV,
                              onClickEdit
                            )}
                          >
                            <EditIcon />
                          </IconButton>
                        </div>
                      </ListItem>
                      <Divider />
                    </div>
                  ))}
              </List>
              {totalCCTV > 0 && (
                <div className={classes.pagination}>
                  <Pagination
                    onChangePage={onChangePage(
                      pagingCCTV.current,
                      pagingCCTV.skip,
                      searchKeyword
                    )}
                    start={pagingCCTV.current}
                    display={pagingCCTV.skip}
                    total={Math.ceil(totalCCTV / pagingCCTV.skip)}
                  />
                </div>
              )}
            </>
          )}
      </>
    );
  }
}

export default withStyles(styles)(SelectCCTV);

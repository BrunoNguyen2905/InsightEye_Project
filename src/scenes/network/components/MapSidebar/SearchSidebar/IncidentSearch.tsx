import * as React from "react";
import * as moment from "moment";
import { withStyles, createStyles, Theme } from "@material-ui/core/styles";
import { DateTimePicker } from "material-ui-pickers";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import SearchIcon from "@material-ui/icons/Search";
import LocationIcon from "@material-ui/icons/LocationOn";
import DateIcon from "@material-ui/icons/AccessTime";
import Pagination from "src/components/Pagination";
import SectionLoading from "src/components/SectionLoading";
import IStyleProps from "src/styles/utils";
import NotFoundCamera from "src/components/NotFoundCamera";
import { IIncidents } from "../../../types/incidents";

const styles = (theme: Theme) =>
  createStyles({
    wrap: {
      paddingTop: theme.spacing.unit * 2,
      height: "100%"
    },
    search: {
      display: "flex",
      flexDirection: "column",
      paddingLeft: theme.spacing.unit * 2,
      paddingRight: theme.spacing.unit * 2,
      paddingBottom: 0,
      paddingTop: theme.spacing.unit * 2
    },
    address: {
      "&  svg": {
        fontSize: 12
      }
    },
    list: {
      height: "calc(100% - 270px)",
      overflow: "auto"
    },
    pagination: {
      textAlign: "center",
      marginTop: theme.spacing.unit
    },
    inMap: {
      paddingLeft: theme.spacing.unit * 2,
      paddingRight: theme.spacing.unit * 2
    },
    range: {
      display: "flex",
      paddingTop: theme.spacing.unit * 2
    },
    startTime: {
      marginRight: theme.spacing.unit * 2
    },
    endTime: {
      marginLeft: theme.spacing.unit * 2
    },
    name: {
      display: "flex",
      "& > span:nth-child(2)": {
        marginLeft: "auto"
      }
    }
  });

function onChangeCheckSearchBoundHandler(cb: (checked: boolean) => void) {
  return (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    cb(target.checked);
  };
}

function onChangeKeywordHandler(cb: (keyword: string) => void) {
  return (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    cb(target.value);
  };
}

function onChangeDateHandler(
  name: string,
  cb: (date: Date, setName: string) => void
) {
  return (date: Date) => {
    cb(date, name);
  };
}

interface Iprops {
  viewDetail: (id: string) => () => void;
  onChangeKeyword: (keyword: string) => void;
  onChangePage: (page: number) => void;
  isLoading: boolean;
  result: IIncidents[];
  isSearchInBound: boolean;
  currentPage: number;
  totalPage: number;
  onSelectResult: (id: string) => () => void;
  onChangeCheckSearchBound: (check: boolean) => void;
  onChangeDate: (data: Date, name: string) => void;
  config: {
    keyword: string;
    startTime: string;
    endTime: string;
  };
}

const IncidentSearch = ({
  viewDetail,
  onChangeDate,
  classes,
  isLoading,
  result,
  isSearchInBound,
  currentPage,
  totalPage,
  onChangePage,
  onSelectResult,
  onChangeCheckSearchBound,
  onChangeKeyword,
  config
}: Iprops & IStyleProps) => (
  <div className={classes.wrap}>
    <div className={classes.search}>
      <TextField
        value={config.keyword}
        onChange={onChangeKeywordHandler(onChangeKeyword)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <SearchIcon />
            </InputAdornment>
          )
        }}
        fullWidth={true}
        className={classes.searchInput}
        placeholder="Search name or address"
      />
      <div className={classes.range}>
        <DateTimePicker
          format="DD/MM/YYYY - H:mm:ss"
          disabled={isLoading}
          className={classes.startTime}
          name="startTime"
          onChange={onChangeDateHandler("startTime", onChangeDate)}
          value={config.startTime ? moment(config.startTime).toDate() : null}
          label="Job from"
        />
        <DateTimePicker
          format="DD/MM/YYYY - H:mm:ss"
          disabled={isLoading}
          className={classes.endTime}
          name="endTime"
          onChange={onChangeDateHandler("endTime", onChangeDate)}
          value={config.endTime ? moment(config.endTime).toDate() : null}
          label="Job to"
        />
      </div>
    </div>
    {isLoading && <SectionLoading />}
    {!isLoading && result.length === 0 && (
      <NotFoundCamera text="Not found any accident" />
    )}
    <div className={classes.list}>
      {!isLoading && result.length > 0 && (
        <List component="nav">
          {result.map(feat => (
            <div key={feat.incidentId}>
              <ListItem
                button={true}
                className={classes.listItem}
                onClick={onSelectResult(feat.incidentId)}
              >
                <ListItemText
                  primary={
                    <div className={classes.name}>
                      <span>{feat.incidentName}</span>{" "}
                      <span>
                        <Button
                          size="small"
                          color="primary"
                          onClick={viewDetail(feat.incidentId)}
                        >
                          View
                        </Button>
                      </span>
                    </div>
                  }
                  secondary={
                    <>
                      <span className={classes.address}>
                        <DateIcon />{" "}
                        {moment
                          .utc(feat.incidentDateUtc)
                          .local()
                          .format("DD/MM/YYYY - H:mm:ss")}
                      </span>
                      <br />
                      <span className={classes.address}>
                        <LocationIcon /> {feat.address}
                      </span>
                    </>
                  }
                />
              </ListItem>
              <Divider />
            </div>
          ))}
        </List>
      )}
    </div>
    {result.length > 0 && (
      <div className={classes.pagination}>
        <Pagination
          disabled={isLoading}
          onChangePage={onChangePage}
          start={currentPage}
          display={5}
          total={totalPage}
        />
      </div>
    )}
    <div className={classes.inMap}>
      <FormControlLabel
        control={
          <Checkbox
            disabled={isLoading}
            onChange={onChangeCheckSearchBoundHandler(onChangeCheckSearchBound)}
            color="primary"
            checked={isSearchInBound}
            value="checkSearchBound"
          />
        }
        label="Search within map"
      />
    </div>
  </div>
);

export default withStyles(styles)(IncidentSearch);

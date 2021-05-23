import * as React from "react";
import { withStyles, createStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import LocationIcon from "@material-ui/icons/LocationOn";
import IStyleProps from "src/styles/utils";
import Pagination from "src/components/Pagination";
import SectionLoading from "src/components/SectionLoading";
import NotFoundCamera from "src/components/NotFoundCamera";
import { Feature, Point } from "geojson";
import { IPointGeoJsonProperties } from "../../../types/GeoProperties";

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
      height: "calc(100% - 186px)",
      overflow: "auto"
    },
    pagination: {
      textAlign: "center",
      marginTop: theme.spacing.unit
    },
    inMap: {
      paddingLeft: theme.spacing.unit * 2,
      paddingRight: theme.spacing.unit * 2
    }
  });

function onChangeKeywordHandler(cb: (keyword: string) => void) {
  return (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    cb(target.value);
  };
}

function onChangeCheckSearchBoundHandler(cb: (checked: boolean) => void) {
  return (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    cb(target.checked);
  };
}

interface Iprops {
  isSearchInBound: boolean;
  result: Array<Feature<Point, IPointGeoJsonProperties>>;
  onChangePage: (page: number) => void;
  onChangeKeyword: (keyword: string) => void;
  currentPage: number;
  totalPage: number;
  isLoading: boolean;
  className?: string;
  onSelectResult: (id: string) => () => void;
  onChangeCheckSearchBound: (check: boolean) => void;
}

const CCTVSearch = ({
  classes,
  isLoading,
  currentPage,
  totalPage,
  onChangePage,
  onChangeKeyword,
  result,
  isSearchInBound,
  onSelectResult,
  onChangeCheckSearchBound
}: Iprops & IStyleProps) => (
  <div className={classes.wrap}>
    <div className={classes.search}>
      <TextField
        onChange={onChangeKeywordHandler(onChangeKeyword)}
        disabled={isLoading}
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
    </div>
    {isLoading && <SectionLoading />}
    {!isLoading && result.length > 0 ? (
      <>
        <div className={classes.list}>
          <List component="nav">
            {result.map(feat => (
              <div key={feat.properties.pointid}>
                <ListItem
                  button={true}
                  className={classes.listItem}
                  onClick={onSelectResult(feat.properties.pointid)}
                >
                  <ListItemText
                    primary={feat.properties.pointname}
                    secondary={
                      <span className={classes.address}>
                        <LocationIcon /> {feat.properties.address}
                      </span>
                    }
                  />
                </ListItem>
                <Divider />
              </div>
            ))}
          </List>
        </div>
        <div className={classes.pagination}>
          <Pagination
            onChangePage={onChangePage}
            start={currentPage}
            display={5}
            total={totalPage}
          />
        </div>
      </>
    ) : (
      <NotFoundCamera />
    )}
    <div className={classes.inMap}>
      <FormControlLabel
        control={
          <Checkbox
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

export default withStyles(styles)(CCTVSearch);

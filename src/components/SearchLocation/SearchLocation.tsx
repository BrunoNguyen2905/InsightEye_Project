import * as React from "react";
import { withStyles, Theme } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import ClearIcon from "@material-ui/icons/Clear";
import * as classNames from "classnames";
import IStyleProps from "src/styles/utils";
import { CSSProperties } from "@material-ui/core/styles/withStyles";
import { debounce } from "lodash-es";
import { GeoCodingService } from "src/helpers/GeoCodingService";

const styles = (theme: Theme): { [k: string]: CSSProperties } => ({
  wrap: {
    width: 300,
    position: "absolute",
    bottom: "10px",
    left: "10px",
    paddingTop: theme.spacing.unit / 2,
    paddingRight: theme.spacing.unit * 2,
    paddingLeft: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit / 2
  },
  list: {
    paddingTop: 0,
    paddingBottom: 0
  },
  listText: {
    fontSize: 13,
    overflow: "hidden",
    alignItems: "center",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis"
  },
  listItem: {
    paddingRight: theme.spacing.unit * 2,
    paddingLeft: theme.spacing.unit * 2
  },
  result: {
    position: "absolute",
    width: "100%",
    bottom: "calc(100% + 4px)",
    left: 0
  }
});

interface IProps {
  className?: string;
  onClickResult: (lng: number, lat: number) => void;
  onClear: () => void;
  lat: number;
  lng: number;
}

interface IStates {
  keyword: string;
  result: google.maps.places.QueryAutocompletePrediction[];
}

class SearchLocation extends React.Component<IProps & IStyleProps, IStates> {
  public state = {
    keyword: "",
    result: [] as google.maps.places.QueryAutocompletePrediction[]
  };

  private debounceCallGeoService = debounce((cb: () => void) => {
    cb();
  }, 250);

  private geo = new GeoCodingService({ withApi: true });

  private onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    this.setState({ keyword: target.value, result: [] });
    e.persist();
    if (!target.value) {
      this.props.onClear();
    }
    this.debounceCallGeoService(() => {
      if (target.value) {
        this.geo
          .textSearch(target.value, this.props.lat, this.props.lng)
          .then(result => {
            this.setState({ result });
          });
      }
    });
  };

  private onClickResult = (
    element: google.maps.places.QueryAutocompletePrediction
  ) => {
    // this.props.onClickResult(
    //   this.state.result[0].geometry.location.lng(),
    //   this.state.result[0].geometry.location.lat()
    // );
    this.geo.getPlace(element.place_id).then(result => {
      this.props.onClickResult(
        result.geometry.location.lng(),
        result.geometry.location.lat()
      );
      this.setState({
        result: []
      });
    });
  };

  private clear = () => {
    this.setState({
      keyword: "",
      result: []
    });
    this.props.onClear();
  };

  public render() {
    const { classes, className } = this.props;
    const { result, keyword } = this.state;
    return (
      <Paper className={classNames(classes.wrap, className)}>
        {result.length > 0 && (
          <Paper className={classes.result}>
            <List className={classes.list}>
              {result.map((element, key) => {
                return (
                  <ListItem
                    button={true}
                    className={classes.listItem}
                    onClick={this.onClickResult.bind(this, element)}
                    key={key}
                  >
                    <ListItemText
                      classes={{
                        primary: classes.listText
                      }}
                      primary={element.description}
                    />
                  </ListItem>
                );
              })}
            </List>
          </Paper>
        )}
        <TextField
          value={keyword}
          fullWidth={true}
          onChange={this.onChangeHandler}
          placeholder="Search places"
          InputProps={{
            disableUnderline: true,
            endAdornment: (
              <InputAdornment position="end">
                {result.length > 0 && <ClearIcon onClick={this.clear} />}
                <SearchIcon />
              </InputAdornment>
            )
          }}
        />
      </Paper>
    );
  }
}

export default withStyles(styles)(SearchLocation);

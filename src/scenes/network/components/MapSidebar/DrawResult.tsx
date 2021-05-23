import * as React from "react";
import * as classNames from "classnames";
import { withStyles, createStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import LocationIcon from "@material-ui/icons/LocationOn";
import ViewQuiltIcon from "@material-ui/icons/ViewQuilt";
import Divider from "@material-ui/core/Divider";
import { Feature, Point } from "geojson";
import NotFoundCamera from "src/components/NotFoundCamera";
import IStyleProps from "../../../../styles/utils";
import { IPointGeoJsonProperties } from "../../types/GeoProperties";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import SidebarCore from "./SidebarCore";
import AddVideoWallDialog from "../../containers/Camera/AddVideoWallDialog";

const styles = (theme: Theme) =>
  createStyles({
    resultDraw: {
      position: "absolute",
      top: 70,
      right: -300,
      width: 300,
      bottom: 30,
      overflow: "auto"
    },
    headline: {
      display: "flex",
      paddingTop: "7px"
    },
    buttonAddAll: {
      display: "flex",
      marginLeft: "auto"
    },
    card: {
      display: "flex",
      flexDirection: "column",
      height: "100%"
    },
    cardContent: {
      display: "flex",
      flexDirection: "column",
      height: "100%",
      padding: 16
    },
    resultDrawOpen: {
      right: 10
    },
    title: {
      padding: theme.spacing.unit * 2,
      display: "flex"
    },
    addressContent: {
      padding: theme.spacing.unit
    },
    content: {
      paddingLeft: theme.spacing.unit * 2,
      paddingRight: theme.spacing.unit * 2,
      paddingBottom: theme.spacing.unit * 2
    },
    list: {
      paddingTop: 0,
      width: "100%"
    },
    listItem: {
      borderLeft: `1px solid ${theme.palette.divider}`
    },
    notFound: {
      paddingTop: 0,
      marginTop: theme.spacing.unit * 2,
      marginBottom: theme.spacing.unit * 2
    },
    notFoundText: {
      display: "flex",
      textAlign: "center",
      justifyContent: "center"
    },
    control: {
      marginTop: theme.spacing.unit * 2,
      textAlign: "center"
    },
    address: {
      "&  svg": {
        fontSize: 12
      }
    },
    button: {
      margin: theme.spacing.unit
    },
    buttonGroup: {
      justifyContent: "center"
    },
    addresses: {
      flex: "1",
      display: "flex",
      overflowY: "auto",
      overflowX: "hidden"
    }
  });

interface IProps {
  step: number;
  isOpenDrawResult: boolean;
}

interface ICameraListProps {
  result: Array<Feature<Point, IPointGeoJsonProperties>>;
  isOpenDrawResult: boolean;
  onCancel: (() => void);
  onSelectCamera: (id: string) => () => void;
  onViewAddress: () => void;
  openAddVideoWall: (listId: string[]) => void;
}
interface IAddressProps {
  data: {
    address: string;
  };
  onCancel: (() => void);
  onCreateIncident: (() => void);
}

function onClickViewListHandler(
  openAddVideoWall: (listId: string[]) => void,
  listPointId: string[]
) {
  return (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    openAddVideoWall(listPointId);
  };
}

const CameraList = ({
  classes,
  onCancel,
  onSelectCamera,
  result,
  onViewAddress,
  openAddVideoWall
}: ICameraListProps & IStyleProps) => (
  <Card className={classes.card}>
    <CardContent className={classes.cardContent}>
      <div className={classes.title}>
        <Typography variant="h5" className={classes.headline}>
          List Camera{" "}
        </Typography>
        <IconButton
          className={classes.buttonAddAll}
          onClick={onClickViewListHandler(
            openAddVideoWall,
            result.map(el => el.properties.id)
          )}
        >
          <ViewQuiltIcon />
        </IconButton>
      </div>
      <AddVideoWallDialog />
      <Divider />
      <div className={classes.addresses}>
        {result.length === 0 && <NotFoundCamera />}
        {result.length > 0 && (
          <List component="nav" className={classes.list}>
            {result.map((feat, index) => (
              <div key={feat.properties.id}>
                <ListItem
                  button={true}
                  onClick={onSelectCamera(feat.properties.id)}
                >
                  <ListItemText
                    primary={feat.properties.pointname}
                    secondary={
                      <span className={classes.address}>
                        <LocationIcon /> {feat.properties.address}
                      </span>
                    }
                  />
                  <div>
                    <IconButton
                      onClick={onClickViewListHandler(openAddVideoWall, [
                        feat.properties.id
                      ])}
                    >
                      <ViewQuiltIcon />
                    </IconButton>
                  </div>
                </ListItem>
                <Divider />
              </div>
            ))}
          </List>
        )}
      </div>
    </CardContent>
    <CardActions className={classes.buttonGroup}>
      <Button
        onClick={onCancel}
        color="default"
        variant="contained"
        className={classes.button}
      >
        Cancel
      </Button>
      <Button
        onClick={onViewAddress}
        color="primary"
        variant="contained"
        className={classes.button}
      >
        New Job
      </Button>
    </CardActions>
  </Card>
);

const IncidentAddress = ({
  classes,
  onCancel,
  onCreateIncident,
  data
}: IAddressProps & IStyleProps) => (
  <Card className={classes.card}>
    <CardContent>
      <div className={classes.title}>
        <Typography variant="h5">Job Address </Typography>
      </div>
      <Divider />
      <div className={classes.addressContent}>
        <Typography variant="body1" component="p">
          {data.address}
        </Typography>
      </div>
    </CardContent>
    <CardActions className={classes.buttonGroup}>
      <Button
        onClick={onCancel}
        color="default"
        variant="contained"
        className={classes.button}
      >
        Cancel
      </Button>
      <Button
        onClick={onCreateIncident}
        color="primary"
        variant="contained"
        className={classes.button}
      >
        New Job
      </Button>
    </CardActions>
  </Card>
);

const DrawResult = (
  props: IProps & ICameraListProps & IAddressProps & IStyleProps
) => {
  const { classes, isOpenDrawResult, step } = props;
  return (
    <SidebarCore
      className={classNames(classes.resultDraw, {
        [classes.resultDrawOpen]: isOpenDrawResult
      })}
    >
      {step === 0 ? <CameraList {...props} /> : <IncidentAddress {...props} />}
    </SidebarCore>
  );
};

export default withStyles(styles)(DrawResult);

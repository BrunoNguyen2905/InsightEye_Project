import * as React from "react";
import { createStyles, withStyles } from "@material-ui/core/styles";
import IStyleProps from "../../../styles/utils";
import { ISite } from "../types/Site";

interface IProps {
  site?: ISite;
  loading: boolean;
  notFound: boolean;
}

const styles = createStyles({
  list: {
    display: "flex",
    flexWrap: "wrap",
    maxWidth: 440,
    padding: 16,

    "& > dt": {
      fontWeight: "bold",
      flexBasis: "50%",
      maxWidth: "50%",
      margin: "0",
      paddingBottom: "20px",
      paddingTop: "20px"
    },

    "& > dd": {
      flexBasis: "50%",
      maxWidth: "50%",
      textAlign: "right",
      margin: "0",
      paddingBottom: "20px",
      paddingTop: "20px"
    }
  }
});

const DetailSite = ({
  classes,
  site,
  notFound,
  loading
}: IStyleProps & IProps) => {
  if (loading) {
    return <p>Loading</p>;
  }

  if (!notFound && !loading && site) {
    return (
      <dl className={classes.list}>
        <dt>type</dt>
        <dd>{site.bts.type}</dd>
        <dt>btsid</dt>
        <dd>{site.bts.btsid}</dd>
        <dt>btsid</dt>
        <dd>{site.bts.btsid}</dd>
        <dt>btsname</dt>
        <dd>{site.bts.btsname}</dd>
        <dt>carriername</dt>
        <dd>{site.bts.carriername}</dd>
        <dt>networkname</dt>
        <dd>{site.bts.networkname}</dd>
        <dt>operatorid</dt>
        <dd>{site.bts.operatorid}</dd>
        <dt>jobid</dt>
        <dd>{site.bts.jobid}</dd>
        <dt>siteid</dt>
        <dd>{site.bts.siteid}</dd>
        <dt>uploadid</dt>
        <dd>{site.bts.uploadid}</dd>
        <dt>location</dt>
        <dd>
          lat: {site.bts.location.lat} - lon: {site.bts.location.lon}
        </dd>
        <dt>totalmsg</dt>
        <dd>{site.bts.totalmsg}</dd>
      </dl>
    );
  }
  return <p>Not found</p>;
};

export default withStyles(styles)(DetailSite);

import * as React from "react";
import Button from "@material-ui/core/Button";
import ButtonIcon from "@material-ui/core/IconButton";
import LastIcon from "@material-ui/icons/LastPage";
import FirstIcon from "@material-ui/icons/FirstPage";
import { withStyles, createStyles, Theme } from "@material-ui/core/styles";
import IStyleProps from "../../styles/utils";
import { CSSProperties } from "@material-ui/core/styles/withStyles";
import PaginationCore from "./PaginationCore";

const pageClick = (page: number, cb: (page: number) => void) => {
  return () => {
    cb(page);
  };
};

const styles = (theme: Theme): { [k: string]: CSSProperties } =>
  createStyles({
    button: {
      minWidth: "auto"
    },
    buttonActive: {
      border: `1px solid ${theme.palette.primary.main}`
    }
  });

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  disabled?: boolean;
  start: number;
  display: number;
  total: number;
  onChangePage?: (page: number) => void;
}

const Pagination = ({
  classes,
  display,
  total,
  start,
  onChangePage,
  disabled,
  ...others
}: IStyleProps & IProps) => (
  <PaginationCore
    disabled={disabled}
    onChangePage={onChangePage}
    start={start}
    total={total}
    display={display}
    // tslint:disable-next-line jsx-no-lambda
    render={(state, setCurrent) => {
      const array = [];
      for (let i = state.head; i <= state.tail; i += 1) {
        array.push(i);
      }
      return (
        <div {...others}>
          {state.head !== 1 && (
            <ButtonIcon
              disabled={state.disabled}
              onClick={pageClick(1, setCurrent)}
            >
              <FirstIcon />
            </ButtonIcon>
          )}
          {array.map((page, index) => (
            <Button
              disabled={state.disabled}
              color={page === state.current ? "primary" : "default"}
              className={`${classes.button} ${page === state.current &&
                classes.buttonActive}`}
              key={index}
              onClick={pageClick(page, setCurrent)}
            >
              {page}
            </Button>
          ))}
          {state.tail !== state.total && (
            <ButtonIcon
              disabled={state.disabled}
              onClick={pageClick(state.total, setCurrent)}
            >
              <LastIcon />
            </ButtonIcon>
          )}
        </div>
      );
    }}
  />
);

export default withStyles(styles)(Pagination);

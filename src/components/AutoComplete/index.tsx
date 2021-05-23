/* eslint-disable react/prop-types */

import * as React from "react";
import "react-select/dist/react-select.css";
import { withStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Input from "@material-ui/core/Input";
import TextField from "@material-ui/core/TextField";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import CancelIcon from "@material-ui/icons/Cancel";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import ClearIcon from "@material-ui/icons/Clear";
import Chip from "@material-ui/core/Chip";
import Select, { ArrowRendererProps } from "react-select";
import IStyleProps from "src/styles/utils";
import { CSSProperties } from "@material-ui/core/styles/withStyles";
import Option, { IOptionProps } from "./Option";

export interface IAutocompleteSuggestion {
  label: string;
  value: string;
}

interface ISelectWrappedProps {
  b: string;
}

const arrowRenderer = (arrowProps: ArrowRendererProps) => {
  return arrowProps.isOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />;
};
const clearRenderer = () => <ClearIcon />;
const valueComponentWithStyle = (classes: { [key: string]: string }) => (
  valueProps: IOptionProps
) => {
  const { value, children, onRemove } = valueProps;

  const onDelete = (event: any) => {
    event.preventDefault();
    event.stopPropagation();
    onRemove(value);
  };

  if (onRemove) {
    return (
      <Chip
        tabIndex={-1}
        label={children}
        className={classes.chip}
        deleteIcon={<CancelIcon onTouchEnd={onDelete} />}
        onDelete={onDelete}
      />
    );
  }

  return <div className="Select-value">{children}</div>;
};

function SelectWrapped(props: ISelectWrappedProps & IStyleProps) {
  const { classes, ...other } = props;

  return (
    <Select
      optionComponent={Option}
      noResultsText={<Typography>{"No results found"}</Typography>}
      arrowRenderer={arrowRenderer}
      clearRenderer={clearRenderer}
      valueComponent={valueComponentWithStyle(classes)}
      {...other}
    />
  );
}

const ITEM_HEIGHT = 48;

const styleGlobleWrap = (
  className: string,
  styleObj: {
    [key: string]: any;
  }
) => {
  return Object.keys(styleObj).reduce((res, key) => {
    return {
      ...res,
      [`${className} ${key}`]: styleObj[key]
    };
  }, {});
};
const styles = (theme: Theme): { [k: string]: CSSProperties } => ({
  root: {
    flexGrow: 1,
    height: 250
  },
  chip: {
    margin: theme.spacing.unit / 4
  },
  // We had to use a lot of global selectors in order to style react-select.
  // We are waiting on https://github.com/JedWatson/react-select/issues/1679
  // to provide a much better implementation.
  // Also, we had to reset the default style injected by the library.
  "@global": styleGlobleWrap(".autocomplete", {
    ".Select-control": {
      display: "flex",
      alignItems: "center",
      border: 0,
      height: "auto",
      background: "transparent",
      "&:hover": {
        boxShadow: "none"
      }
    },
    ".Select-multi-value-wrapper": {
      flexGrow: 1,
      display: "flex",
      flexWrap: "wrap"
    },
    ".Select--multi .Select-input": {
      margin: 0
    },
    ".Select.has-value.is-clearable.Select--single > .Select-control .Select-value": {
      padding: 0
    },
    ".Select-noresults": {
      padding: theme.spacing.unit * 2
    },
    ".Select-input": {
      display: "inline-flex !important",
      padding: 0,
      height: "auto"
    },
    ".Select-input input": {
      background: "transparent",
      border: 0,
      padding: 0,
      cursor: "default",
      display: "inline-block",
      fontFamily: "inherit",
      fontSize: "inherit",
      margin: 0,
      outline: 0
    },
    ".Select-placeholder, .Select--single .Select-value": {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: "flex",
      alignItems: "center",
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.pxToRem(16),
      padding: 0
    },
    ".Select-placeholder": {
      opacity: 0.42,
      color: theme.palette.common.black
    },
    ".Select-menu-outer": {
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[2],
      position: "absolute",
      left: 0,
      top: `calc(100% + ${theme.spacing.unit}px)`,
      width: "100%",
      zIndex: 2,
      maxHeight: ITEM_HEIGHT * 4.5
    },
    ".Select.is-focused:not(.is-open) > .Select-control": {
      boxShadow: "none"
    },
    ".Select-menu": {
      maxHeight: ITEM_HEIGHT * 4.5,
      overflowY: "auto"
    },
    ".Select-menu div": {
      boxSizing: "content-box"
    },
    ".Select-arrow-zone, .Select-clear-zone": {
      color: theme.palette.action.active,
      cursor: "pointer",
      height: 21,
      width: 21,
      zIndex: 1
    },
    // Only for screen readers. We can't use display none.
    ".Select-aria-only": {
      position: "absolute",
      overflow: "hidden",
      clip: "rect(0 0 0 0)",
      height: 1,
      width: 1,
      margin: -1
    }
  })
});

interface IAutoCompleteProps {
  value: string | string[];
  onChange: (value: string) => void;
  placeholder?: string;
  name: string;
  suggestions: IAutocompleteSuggestion[];
  multi?: boolean;
  label?: string;
}

const AutoComplete = (props: IAutoCompleteProps & IStyleProps) => {
  const { classes } = props;

  const onChange = (event: any) => props.onChange(event);

  if (!props.label) {
    return (
      <Input
        className="autocomplete"
        fullWidth={true}
        inputComponent={SelectWrapped}
        value={props.value}
        onChange={onChange}
        placeholder={props.placeholder}
        id="react-select-single"
        inputProps={{
          classes,
          name: props.name,
          instanceId: props.name,
          simpleValue: true,
          options: props.suggestions,
          multi: props.multi
        }}
      />
    );
  } else {
    return (
      <TextField
        className="autocomplete"
        fullWidth={true}
        value={props.value}
        onChange={onChange}
        placeholder={props.placeholder}
        name="react-select-chip-label"
        label={props.label}
        InputLabelProps={{
          shrink: true
        }}
        InputProps={{
          inputComponent: SelectWrapped,
          inputProps: {
            classes,
            multi: props.multi,
            instanceId: props.name,
            id: props.name,
            simpleValue: true,
            options: props.suggestions
          }
        }}
      />
    );
  }
};

export default withStyles(styles)(AutoComplete);

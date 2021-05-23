import { IStyleTypeProps } from "src/styles/utils";
import { toolbarStyles } from "../styles/toolBar";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import * as React from "react";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import * as classNames from "classnames";

export interface ISelectItem<T> {
  value: T;
  label: string;
}

export const SelectFilter = <T extends string | number = string>({
  label,
  type,
  change,
  classes,
  items,
  className
}: {
  label: string;
  items: Array<ISelectItem<T>>;
  type: T;
  className?: string;
  change: (event: any) => void;
} & IStyleTypeProps<typeof toolbarStyles>) => (
  <FormControl className={classNames(classes.formControl, className || "")}>
    <InputLabel htmlFor="age-simple">{label}</InputLabel>
    <Select
      value={type}
      onChange={change}
      input={<Input name="age" id="age-auto-width" />}
      autoWidth={true}
    >
      {items.map((typeITem, idx) => (
        <MenuItem key={idx} value={typeITem.value}>
          {typeITem.label}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

import * as React from "react";
import MenuItem from "@material-ui/core/MenuItem";

interface IOption {
  a?: string;
}

export interface IOptionProps {
  option: IOption;
  onSelect: (option: IOption, event: any) => void;
  children: React.ReactElement<{}> | Array<React.ReactElement<{}>>;
  isFocused: boolean;
  isSelected: boolean;
  onFocus: (event: any) => void;
  value: string;
  onRemove: (value: string) => void;
}

class Option extends React.Component<IOptionProps> {
  private handleClick = (event: any) => {
    this.props.onSelect(this.props.option, event);
  };

  public render() {
    const { children, isFocused, isSelected, onFocus } = this.props;

    return (
      <MenuItem
        onFocus={onFocus}
        selected={isFocused}
        onClick={this.handleClick}
        component="div"
        style={{
          fontWeight: isSelected ? 500 : 400
        }}
      >
        {children}
      </MenuItem>
    );
  }
}

export default Option;

import * as React from "react";

const getStateFromProps = ({
  total,
  start,
  display,
  disabled = false
}: {
  disabled?: boolean;
  total: number;
  start: number;
  display: number;
}) => {
  const totalFinal = total > 0 ? total : 1;
  let currentFinal = start > 0 ? start : 1;
  let displayFinal = display > 0 ? display : 1;
  currentFinal = currentFinal < totalFinal ? currentFinal : totalFinal;
  displayFinal = displayFinal < totalFinal ? displayFinal : totalFinal;
  return {
    current: currentFinal,
    display: displayFinal,
    total: totalFinal,
    disabled
  };
};

const getRange = ({
  total,
  current,
  display
}: {
  current: number;
  display: number;
  total: number;
}) => {
  let head = 1;
  let tail = total;

  if (display < tail) {
    const rightSideRange = Math.round(display / 2 - 0.5);

    const leftSideRange =
      display % 2 === 0 ? rightSideRange - 1 : rightSideRange;

    if (current <= leftSideRange + 1) {
      tail = display;
    } else if (current >= total - rightSideRange) {
      head = total - display + 1;
    } else {
      head = current - leftSideRange;
      tail = current + rightSideRange;
    }
  }

  return { head, tail };
};

interface IProps {
  disabled?: boolean;
  render: (
    state: IStates,
    setCurrent: (page: number) => void
  ) => React.ReactNode;
  start: number;
  display: number;
  total: number;
  onChangePage?: (page: number) => void;
}

interface IStates {
  disabled: boolean;
  current: number;
  display: number;
  tail: number;
  head: number;
  total: number;
}

class Pagination extends React.Component<IProps, IStates> {
  constructor(props: IProps) {
    super(props);
    const state = getStateFromProps(props);
    this.setCurrent = this.setCurrent.bind(this);

    this.state = {
      ...state,
      ...getRange(state)
    };
  }

  public componentWillReceiveProps(nextProps: IProps) {
    const {
      disabled: currentDisabled,
      start: currentStart,
      display: currentDisplay,
      total: currentTotal
    } = this.props;
    const { start, display, total, disabled } = nextProps;
    if (
      currentDisabled !== disabled ||
      currentStart !== start ||
      currentDisplay !== display ||
      currentTotal !== total
    ) {
      const state = getStateFromProps({
        total,
        start,
        display,
        disabled
      });
      this.setState({
        ...state,
        ...getRange(state)
      });
    }
  }

  private setCurrent(page: number) {
    const state = { ...this.state, current: page };
    if (this.props.onChangePage) {
      this.props.onChangePage(page);
    }
    this.setState({
      ...state,
      ...getRange(state)
    });
  }

  public render() {
    return this.props.render({ ...this.state }, this.setCurrent);
  }
}

export default Pagination;

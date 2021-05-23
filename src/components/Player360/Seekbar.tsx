import * as React from "react";
import LinearProgress from "@material-ui/core/LinearProgress";

interface ISeekBarProps {
  value: number;
  seek: (value: number) => void;
}
class Seekbar extends React.Component<ISeekBarProps> {
  private seekRef: React.RefObject<HTMLDivElement>;
  private isSeeking: boolean;

  constructor(props: ISeekBarProps) {
    super(props);
    this.seekRef = React.createRef();
  }

  public componentDidMount() {
    document.addEventListener("mousemove", this.dragSeek);
    document.addEventListener("mouseup", this.endSeek);
  }

  public componentWillUnmount() {
    document.removeEventListener("mousemove", this.dragSeek);
    document.removeEventListener("mouseup", this.endSeek);
  }

  private onClick = (e: any) => {
    const current = this.seekRef.current;
    if (!current) {
      return;
    }
    const rect = current.getBoundingClientRect();
    const clientX: number = e.clientX;
    const rowValue = clientX - rect.left;
    const value = (rowValue / rect.width) * 100;
    this.seek(value);
  };

  private seek(value: number) {
    this.props.seek(Math.max(Math.min(value, 100), 0));
  }

  private startSeek(e: any) {
    this.isSeeking = true;
    this.onClick(e);
  }
  private endSeek = (e: any) => {
    console.log({ ...e });
    if (this.isSeeking) {
      this.onClick(e);
    }
    this.isSeeking = false;
  };

  private dragSeek = (e: any) => {
    if (this.isSeeking) {
      console.log({ ...e });
      this.onClick(e);
    }
  };

  public render() {
    const { value } = this.props;
    const onClick = (e: any) => this.onClick(e);
    const startSeek = (e: any) => this.startSeek(e);
    return (
      <div
        style={{ height: "24px", paddingTop: "10px" }}
        ref={this.seekRef}
        onClick={onClick}
        onMouseDown={startSeek}
      >
        <LinearProgress value={value} variant="determinate" />
      </div>
    );
  }
}

export default Seekbar;

declare module "react-plyr" {
  import * as React from "react";
  import PlyrPlayer from "plyr";

  interface IProp {
    type: string;
    videoId?: string;
    sources?: any;
    title?: string;
    autoplay?: boolean;
    currentTime?: number;
    onTimeUpdate?: (time: number) => void;
    onPlay?: () => void;
    onLoadedData?: () => void;
    onLoadedmetadata?: (...args: any[]) => void;
  }
  export default class Plyr extends React.Component<IProp> {}

  export interface PlyrEvent extends CustomEvent {
    readonly detail: { readonly plyr: PlyrPlayer };
  }
}

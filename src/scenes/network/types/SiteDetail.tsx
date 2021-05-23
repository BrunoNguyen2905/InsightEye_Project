import { ISite } from "./Site";

export interface ISiteDetail {
  [id: string]: {
    data?: ISite;
    state: {
      loading: boolean;
      notFound: boolean;
    };
  };
}

export interface ISiteDetailTab {
  siteid: string;
  name?: string;
}

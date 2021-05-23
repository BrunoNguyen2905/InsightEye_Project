import { UNIQUE_ID } from "./sessionId";
import { IUserInfo } from "../types/User";

export default class UrlCached {
  private dics: { [key: string]: { value: string; time: Date } };

  constructor(private acc: IUserInfo, private cachedTime: number) {
    this.dics = {};
  }

  private keyCreate(shareKey: string) {
    return `${UNIQUE_ID}_${this.acc.UserId}_${shareKey}`;
  }

  public setUrl(shareKey: string, value: string) {
    const key = this.keyCreate(shareKey);
    this.dics[key] = {
      value,
      time: new Date()
    };
  }

  public getUrl(shareKey: string): string | null {
    const key = this.keyCreate(shareKey);
    const storeValue = this.dics[key];
    if (!storeValue) {
      return null;
    }
    if (new Date().getTime() - storeValue.time.getTime() > this.cachedTime) {
      return null;
    }
    return storeValue.value;
  }
}

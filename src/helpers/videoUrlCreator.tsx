// import IAccount from "../types/Account";
import { UNIQUE_ID } from "./sessionId";
import jsSHA from "jssha";
import UrlCached from "./urlCached";
import { IUserInfo } from "../types/User";

/* Define function for escaping user input to be treated as 
   a literal string within a regular expression */
function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/* Define functin to find and replace specified term with replacement string */
function replaceAll(str: string, term: string, replacement: string) {
  return str.replace(new RegExp(escapeRegExp(term), "g"), replacement);
}

function hashData(userId: string, sessionId: string, publicKey: string) {
  const templateToHash = userId + "_" + sessionId + "_" + publicKey;

  const shaObj = new jsSHA("SHA-256", "TEXT");
  shaObj.update(templateToHash);
  const hash = shaObj.getHash("B64");
  let rhash = hash.replace("+", "-").replace("/", "_");
  rhash = replaceAll(hash, "+", "-");
  rhash = replaceAll(rhash, "/", "_");
  return rhash;
}

const CACHED_TIME = 24 * 60 * 60 * 1000;

export class VideoUtils {
  private static account: IUserInfo;
  private static urlDic: UrlCached;

  public static updateUser(acc: IUserInfo) {
    this.urlDic = new UrlCached(acc, CACHED_TIME);
    this.account = acc;
  }

  private static getShareKey(shareUrl: string): string {
    return shareUrl.split("/").splice(-1, 1)[0];
  }

  public static prepareUrl(shareUrl: string) {
    const cachedUrl = this.urlDic.getUrl(shareUrl);
    if (cachedUrl) {
      return cachedUrl;
    }
    const shareKey = this.getShareKey(shareUrl);
    const userId = this.account.UserId;
    const sessionId = UNIQUE_ID;

    const hashKey = hashData(userId, sessionId, shareKey);
    const url = shareUrl.replace(shareKey, hashKey);

    this.urlDic.setUrl(shareUrl, url);

    return url;
  }
}

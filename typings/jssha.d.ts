declare module "jssha" {
  export default class jsSHA {
    constructor(name: string, text: string);
    public update(message: string): any;
    public getHash(key: string): string;
  }
}

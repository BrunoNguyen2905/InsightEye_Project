export function valueof<T>(obj: { [key: string]: T }): T[] {
  return Object.keys(obj).map(objKey => obj[objKey]);
}

export default function getErrorMessage(
  res: { ErrorMessage?: string } & string[],
  defaultMsg: string
): string {
  if (Array.isArray(res) && res.length > 0) {
    return res[0];
  } else if (typeof res === "object" && res.ErrorMessage) {
    return res.ErrorMessage;
  }
  return defaultMsg;
}

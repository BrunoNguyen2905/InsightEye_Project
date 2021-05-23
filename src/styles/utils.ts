import { Theme } from "@material-ui/core/styles";

interface IClassesType {
  [k: string]: string;
}
interface IStyleProps<T extends IClassesType = IClassesType> {
  classes: T;
  theme?: Theme;
}
export type IStyleTypeProps<T extends (theme: Theme) => any> = IStyleProps<
  StyleType<T>
>;

// interface IStyleProps {
//     <T extends Object>(): T & IStyleProps;
// }

export default IStyleProps;

export type StyleType<T extends (theme: Theme) => any> = Record<
  keyof ReturnType<T>,
  string
>;

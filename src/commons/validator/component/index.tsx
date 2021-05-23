export interface IVElementProps {
  errorText?: string;
}
interface IVProps {
  control: React.ReactElement<IVElementProps>;
}

export const Validator = ({ control }: IVProps) => {
  return { control };
};

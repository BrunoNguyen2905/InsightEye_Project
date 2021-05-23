export default interface IServerResponse<T> {
  status: boolean;
  message: string;
  data: T;
}

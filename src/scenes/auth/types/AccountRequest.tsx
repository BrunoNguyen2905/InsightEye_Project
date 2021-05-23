export default interface IAccountRequest {
  grant_type: string;
  username: string;
  password: string;
  client_id: string;
  client_secret: string;
}

export const createRequest = ({
  username,
  password
}: {
  username: string;
  password: string;
}): IAccountRequest => {
  return {
    grant_type: "password",
    username,
    password,
    client_id: "b681e44b-7612-4c02-8bcd-69e4b874f4e1",
    client_secret: "160b935e-9e8c-45c5-8949-d1c681650a08"
  };
};

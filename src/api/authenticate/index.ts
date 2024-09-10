import API, { IStatus } from "..";

export async function login(postData: {
  username: string;
  password: string;
}): Promise<{
   name: any;
  systemUser: any;
  token: string;
  message?: string;
  status: IStatus;
}> {
  const response = await API.post("Authenticate/loginNew", postData);
  return response.data;
}

import API, { IStatus } from "..";

export async function login(postData: {
  username: string;
  password: string;
}): Promise<{
  firstLogin: number;
  name: any;
  systemUser: any;
  token: string;
  message?: string;
  status: IStatus;
}> {
  const response = await API.post("Authenticate/loginNew", postData);
  return response.data;
}

export async function updatePassword(postData: {
  type: "forgot" | "reset";
  oldPassword?: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<{
  message?: string;
  status: IStatus;
}> {
  const response = await API.post("Authenticate/update-password", postData);
  return response.data;
}

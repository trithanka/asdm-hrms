import API, { IStatus } from "..";
import { IEmployeeLocation } from "../employee/employee-types";
import { ILocation, IPostLocation } from "./location-types";

export async function fetchLocations(): Promise<{
  locationList: ILocation[];
  message?: string;
  status: IStatus;
}> {
  const response = await API.post("/LocationMapping/location/get");
  return response.data;
}

export async function postLocation(
  param: IPostLocation
): Promise<{ status: IStatus; message?: string }> {
  const response = await API.post("/LocationMapping/location/add", param);
  return response.data;
}

export async function associateEmployeeLocation({
  id,
  locationId,
}: {
  id: number;
  locationId: number;
}): Promise<{
  locationHistory: IEmployeeLocation[];
  locationActive: ILocation;
  status: IStatus;
  message?: string;
}> {
  const response = await API.post("LocationMapping/location/associate", {
    id,
    locationId,
  });
  return response.data;
}

export async function fetchEmployeeByLocation(id: number): Promise<{
  getEmployeesByLocation: {
    employeeCode: string;
    name: string;
  }[];
  status: IStatus;
  message?: string;
}> {
  const response = await API.post("LocationMapping/location/getEmployees", {
    id,
  });
  return response.data;
}

import API from "..";
import { ITimeAllocation } from "../../features/time-management/types";
import { ITimeAllocationPayload, ITimeAllocationResponse } from "./types";

export interface ITimeAllocationResult {
    data: ITimeAllocation[];
    total: number;
    pages: number;
}

export const fetchTimeAllocations = async (
    page: number = 0,
    limit: number = 10,
    search: string = ""
): Promise<ITimeAllocationResult> => {
    try {
        const response = await API.post<ITimeAllocationResponse>(
            "TimeAllocation/get",
            {
                page,
                limit,
                search,
            }
        );

        if (response.data && response.data.data && response.data.data.data) {
            // Map API data to our internal ITimeAllocation type
            const mappedData = response.data.data.data.map((item) => ({
                id: item.pklHrmsTimeAllocation,
                name: item.vsAllocatedName,
                time: item.vsAllocationTime,
                type: item.vsAllocatedType,
                timeType: item.vsAllocationTimeType,
                created_at: item.dtCreated,
                updated_at: item.dtUpdated,
            }));

            return {
                data: mappedData,
                total: response.data.data.total,
                pages: response.data.data.pages,
            };
        }
        return { data: [], total: 0, pages: 0 };
    } catch (error) {
        console.error("Error fetching time allocations:", error);
        throw error;
    }
};

export interface IAddOrUpdateResponse {
    status: string;
    message: string;
}

export const addOrUpdateTimeAllocation = async (
    payload: ITimeAllocationPayload
): Promise<IAddOrUpdateResponse> => {
    try {
        const response = await API.post<IAddOrUpdateResponse>(
            "TimeAllocation/add-or-modify",
            payload
        );
        return response.data;
    } catch (error) {
        console.error("Error saving time allocation:", error);
        throw error;
    }
};

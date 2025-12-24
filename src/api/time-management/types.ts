export interface ITimeAllocationRaw {
    pklHrmsTimeAllocation: number;
    vsAllocatedName: string;
    vsAllocationTime: string;
    vsAllocatedType: string;
    vsAllocationTimeType: string;
    dtCreated: string;
    dtUpdated: string;
}

export interface ITimeAllocationResponse {
    status: string;
    data: {
        total: number;
        pages: number;
        data: ITimeAllocationRaw[];
    };
    message: string;
    statusCode: number;
}

export interface ITimeAllocationPayload {
    method: "add" | "modify";
    allocationId?: number;
    allocationName: string;
    allocationTime: string;
    allocationType: string;
    allocationTimeType: string;
}

export interface IAddOrUpdateResponse {
    status: string;
    message: string | string[];
    statusCode: number;
}

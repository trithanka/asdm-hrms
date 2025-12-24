export interface ITimeAllocation {
    id: number; // pklHrmsTimeAllocation
    name: string; // vsAllocatedName
    time: string; // vsAllocationTime
    type: "attendance" | "leave" | string; // vsAllocatedType
    timeType: "In Time" | "In Hour" | string; // vsAllocationTimeType
    created_at?: string; // dtCreated
    updated_at?: string; // dtUpdated
}

export const MOCK_ALLOCATIONS: ITimeAllocation[] = [
    {
        id: 1,
        name: "checkIn",
        time: "10:00:00",
        type: "attendance",
        timeType: "In Time",
        created_at: "2025-12-19 13:58:37",
        updated_at: "2025-12-22 12:59:26",
    },
    {
        id: 2,
        name: "checkOut",
        time: "17:00:00",
        type: "attendance",
        timeType: "In Time",
        created_at: "2025-12-19 13:58:37",
        updated_at: "2025-12-22 12:59:49",
    },
    {
        id: 3,
        name: "1stHalf",
        time: "09:00:00",
        type: "leave",
        timeType: "In Time",
        created_at: "2025-12-19 13:58:37",
        updated_at: "2025-12-22 12:59:46",
    },
    {
        id: 4,
        name: "2ndHalf",
        time: "12:00:00",
        type: "leave",
        timeType: "In Time",
        created_at: "2025-12-19 13:58:37",
        updated_at: "2025-12-22 12:59:42",
    },
    {
        id: 5,
        name: "graceCheckOut",
        time: "00:30",
        type: "attendance",
        timeType: "In Hour",
        created_at: "2025-12-19 13:58:37",
        updated_at: "2025-12-22 12:59:34",
    },
    {
        id: 6,
        name: "graceCheckIn",
        time: "00:30",
        type: "attendance",
        timeType: "In Hour",
        created_at: "2025-12-19 13:58:37",
        updated_at: "2025-12-22 12:59:36",
    },
];

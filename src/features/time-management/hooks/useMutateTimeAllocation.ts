import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addOrUpdateTimeAllocation } from "../../../api/time-management/api";
import { ITimeAllocationPayload } from "../../../api/time-management/types";

export const useMutateTimeAllocation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: ITimeAllocationPayload) =>
            addOrUpdateTimeAllocation(payload),
        onSuccess: () => {
            // Invalidate the list to refetch data
            queryClient.invalidateQueries({ queryKey: ["time-allocations"] });
        },
    });
};

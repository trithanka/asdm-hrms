import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { salaryFileApi } from "../../../api/salary/salary-file-api";
import toast from "react-hot-toast";

export const useSalaryBreakingMaster = (structType: string, fyId?: string) => {
    return useQuery({
        queryKey: ["salary-breaking-master", structType, fyId],
        queryFn: () => salaryFileApi.getSalaryBreakingMaster(structType, fyId),
        enabled: !!structType,
    });
};

export const useSaveSalaryBreakingMaster = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: any) => salaryFileApi.saveSalaryBreakingMaster(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["salary-breaking-master"] });
            toast.success("Record saved successfully");
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Failed to save record");
        }
    });
};

export const useToggleSalaryBreakingMaster = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => salaryFileApi.toggleSalaryBreakingMaster(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["salary-breaking-master"] });
            toast.success("Status updated successfully");
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Failed to update status");
        }
    });
};

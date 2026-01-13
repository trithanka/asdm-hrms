import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { salaryFileApi } from "../../../api/salary/salary-file-api";
import toast from "react-hot-toast";

export const useSaveFinancialYear = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: { vsFy: string, iStartMonth: number, bEnabled: number, pklSalaryFinancialYearId?: number }) =>
            salaryFileApi.saveFinancialYear(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["fy-master"] });
            toast.success("Financial year saved successfully");
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Failed to save financial year");
        }
    });
};

export const useToggleFinancialYear = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => salaryFileApi.toggleMasters(id, "toggleFyMasterQ", "fyMasterCard"),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["fy-master"] });
            toast.success("Status updated successfully");
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Failed to update status");
        }
    });
};

export const useFyMaster = () => {
    return useMutation({
        mutationFn: () => salaryFileApi.getFyMaster(),
    });
};

// Also adding useQuery version for better usage in management page
export const useGetFyMaster = () => {
    return useQuery({
        queryKey: ["fy-master"],
        queryFn: () => salaryFileApi.getFyMaster(),
    });
};

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { salaryFileApi } from "../../../api/salary/salary-file-api";
import toast from "react-hot-toast";

export const useSaveFinancialYear = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: { vsFy: string, iStartMonth: number, bEnabled: number, pklSalaryFinancialYearId?: number }) =>
            salaryFileApi.saveFinancialYear(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["salary-structure-types"] });
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
        mutationFn: (id: number) => salaryFileApi.toggleFinancialYear(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["salary-structure-types"] });
            toast.success("Status updated successfully");
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Failed to update status");
        }
    });
};

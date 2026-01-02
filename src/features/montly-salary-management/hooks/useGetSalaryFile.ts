import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GenerateSalaryFilePayload, GenerateSalaryPayload, salaryFileApi } from "../../../api/salary/salary-file-api";


export const useSalaryFiles = (month?: number, year?: number) => {
    return useQuery({
        queryKey: month && year ? ["salary-files", month, year] : ["salary-files"],
        queryFn: () => {
            if (month && year) {
                return salaryFileApi.getSalaryFilesByDate(month, year);
            }
            return salaryFileApi.getSalaryFiles();
        },
    });
};

export const useSalaryStructureTypes = () => {
    return useQuery({
        queryKey: ["salary-structure-types"],
        queryFn: () => salaryFileApi.getSalaryStructureTypes(),
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    });
};

export const useEmployeeList = (
    salaryStructureType?: string,
    generateMonth?: string,
    generateYear?: string
) => {
    return useQuery({
        queryKey: ["employee-list", salaryStructureType, generateMonth, generateYear],
        queryFn: () => {
            if (!salaryStructureType || !generateMonth || !generateYear) {
                return Promise.resolve({ status: "success", message: "", employeeList: [], statusCode: 200 });
            }
            return salaryFileApi.getEmployeeList({
                salaryStructureType,
                generateMonth,
                generateYear,
            });
        },
        enabled: !!salaryStructureType && !!generateMonth && !!generateYear,
    });
};

export const useGenerateSalary = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: GenerateSalaryPayload) =>
            salaryFileApi.generateSalary(payload),
        onSuccess: () => {
            // Invalidate and refetch employee list
            queryClient.invalidateQueries({ queryKey: ["employee-list"] });
        },
    });
};

export const useGenerateSalaryFile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: GenerateSalaryFilePayload) =>
            salaryFileApi.generateSalaryFile(payload),
        onSuccess: () => {
            // Invalidate and refetch salary files
            queryClient.invalidateQueries({ queryKey: ["salary-files"] });
        },
    });
};

export const useDownloadSalaryFile = () => {
    return useMutation({
        mutationFn: (fileId: number) => salaryFileApi.downloadSalaryFile(fileId),
        onSuccess: (blob: Blob, fileId) => {
            // Create download link
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `salary-file-${fileId}.xlsx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        },
    });
};

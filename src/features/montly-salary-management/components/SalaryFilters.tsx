import React from "react";
import {
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    Typography,
} from "@mui/material";
import { SALARY_MONTHS, SALARY_STAGE_COLORS, SALARY_STAGE_LABELS } from "../constants/salaryConstants";

interface SalaryFiltersProps {
    selectedYear: number | "";
    setSelectedYear: (v: number) => void;
    selectedMonth: string;
    setSelectedMonth: (v: string) => void;
    selectedDepartment: string;
    setSelectedDepartment: (v: string) => void;
    departmentOptions: { label: string; value: string }[];
    selectedStructureType: string;
    setSelectedStructureType: (v: string) => void;
    formattedYears: { value: number; label: string }[];
    isLoadingTypes: boolean;
    structureTypesData: any;
    isMonthDisabled: (m: string) => boolean;
    currentStepTrack: number | null;
    children?: React.ReactNode;
}

export function SalaryFilters({
    selectedYear,
    setSelectedYear,
    selectedMonth,
    setSelectedMonth,
    selectedDepartment,
    setSelectedDepartment,
    departmentOptions,
    selectedStructureType,
    setSelectedStructureType,
    formattedYears,
    isLoadingTypes,
    structureTypesData,
    isMonthDisabled,
    currentStepTrack,
    children,
}: SalaryFiltersProps) {
    const stageKey = currentStepTrack ?? 1;
    const stageColor = SALARY_STAGE_COLORS[stageKey] ?? SALARY_STAGE_COLORS[1];
    const stageLabel = SALARY_STAGE_LABELS[stageKey] ?? `Step ${stageKey}`;

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2,
                backgroundColor: "white",
                p: 2,
                borderRadius: 2,
                boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
                border: "1px solid #edf2f7",
            }}
        >
            {/* Dropdown filters */}
            <Stack direction="row" spacing={1.5} sx={{ flexWrap: "wrap" }}>
                <FormControl size="small" sx={{ minWidth: 160 }}>
                    <InputLabel id="year-label">Financial Year</InputLabel>
                    <Select
                        labelId="year-label"
                        id="year-select"
                        value={selectedYear}
                        label="Financial Year"
                        onChange={(e) => setSelectedYear(e.target.value as number)}
                        disabled={isLoadingTypes || formattedYears.length === 0}
                    >
                        {formattedYears.map((year) => (
                            <MenuItem key={year.value} value={year.value}>
                                {year.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 140 }}>
                    <InputLabel id="month-label">Month</InputLabel>
                    <Select
                        labelId="month-label"
                        id="month-select"
                        value={selectedMonth}
                        label="Month"
                        onChange={(e) => setSelectedMonth(e.target.value)}
                    >
                        {SALARY_MONTHS.map((month) => (
                            <MenuItem
                                key={month.value}
                                value={month.value}
                                disabled={isMonthDisabled(month.value)}
                                sx={{ display: isMonthDisabled(month.value) ? "none" : "flex" }}
                            >
                                {month.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 180 }}>
                    <InputLabel id="structure-type-label">Salary Structure</InputLabel>
                    <Select
                        labelId="structure-type-label"
                        id="structure-type-select"
                        value={selectedStructureType}
                        label="Salary Structure"
                        onChange={(e) => setSelectedStructureType(e.target.value)}
                        disabled={isLoadingTypes}
                    >
                        {structureTypesData?.data?.salaryStructureTypes?.map((type: any) => (
                            <MenuItem key={type.type} value={type.type}>
                                {type.type.replace(/_/g, " ")}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 190 }}>
                    <InputLabel id="department-label">Department</InputLabel>
                    <Select
                        labelId="department-label"
                        id="department-select"
                        value={selectedDepartment}
                        label="Department"
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                    >
                        <MenuItem value="all">All Departments</MenuItem>
                        {departmentOptions.map((department) => (
                            <MenuItem key={department.value} value={department.value}>
                                {department.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Stack>

            {/* Stage badge */}
            {selectedStructureType && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, ml: "auto" }}>
                    <Typography variant="subtitle2" sx={{ color: "text.secondary", fontWeight: 600 }}>
                        Current Stage:
                    </Typography>
                    <Box
                        sx={{
                            px: 1.5, py: 0.5, borderRadius: 10,
                            fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase",
                            ...stageColor,
                        }}
                    >
                        {stageLabel}
                    </Box>
                </Box>
            )}
            {children}
        </Box>
    );
}

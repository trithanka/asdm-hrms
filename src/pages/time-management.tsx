
import {
    Alert,
    AlertTitle,
    Box,
    CircularProgress,
    InputAdornment,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";
import TimeAllocationList from "../features/time-management/components/time-allocation-list";
import { useMutateTimeAllocation } from "../features/time-management/hooks/useMutateTimeAllocation";
import { useTimeAllocations } from "../features/time-management/hooks/useTimeAllocations";
import { ITimeAllocation } from "../features/time-management/types";

// Helper to extract error message
const getErrorMessage = (error: any): string | string[] => {
    if (error.response && error.response.data && error.response.data.message) {
        return error.response.data.message;
    }
    return "An unexpected error occurred.";
};

export default function TimeManagement() {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10);
    const [error, setError] = useState<string | string[] | null>(null);

    const { data: response, isLoading } = useTimeAllocations(page, limit, search);
    const { mutate: saveAllocation } = useMutateTimeAllocation();

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLimit(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Handle Inline Update from List
    const handleUpdate = (item: ITimeAllocation, newTime: string) => {
        setError(null);
        saveAllocation(
            {
                method: "modify",
                allocationId: item.id,
                allocationName: item.name,
                allocationTime: newTime, // Use the edited time
                allocationType: item.type,
                allocationTimeType: item.timeType,
            },
            {
                onError: (err: any) => {
                    setError(getErrorMessage(err));
                },
            }
        );
    };

    return (
        <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h4" fontWeight={700}>
                    Time Management
                </Typography>
            </Stack>

            {/* Error Display */}
            {error && (
                <Alert severity="error">
                    <AlertTitle>Error</AlertTitle>
                    {Array.isArray(error) ? (
                        <ul style={{ margin: 0, paddingLeft: 20 }}>
                            {error.map((err, index) => (
                                <li key={index}>{err}</li>
                            ))}
                        </ul>
                    ) : (
                        error
                    )}
                </Alert>
            )}

            <TextField
                placeholder="Search allocations..."
                variant="outlined"
                size="small"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon color="action" />
                        </InputAdornment>
                    ),
                }}
                sx={{ maxWidth: 300 }}
            />

            {isLoading ? (
                <Box display="flex" justifyContent="center" p={4}>
                    <CircularProgress />
                </Box>
            ) : (
                <TimeAllocationList
                    data={response?.data ?? []}
                    count={response?.total ?? 0}
                    page={page}
                    rowsPerPage={limit}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    onUpdate={handleUpdate}
                />
            )}
        </Stack>
    );
}

import {
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
} from "@mui/material";
import { useState } from "react";
import { ITimeAllocation } from "../types";

interface ITimeAllocationList {
    data: ITimeAllocation[];
    onUpdate: (item: ITimeAllocation, newTime: string) => void;
    count: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (event: unknown, newPage: number) => void;
    onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function TimeAllocationList({
    data,
    onUpdate,
    count,
    page,
    rowsPerPage,
    onPageChange,
    onRowsPerPageChange,
}: ITimeAllocationList) {
    // State to track edited times: { [id]: "HH:MM:SS" }
    const [editedTimes, setEditedTimes] = useState<{ [key: number]: string }>({});

    const handleTimeChange = (id: number, value: string) => {
        setEditedTimes((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleUpdateClick = (row: ITimeAllocation) => {
        const newTime = editedTimes[row.id] ?? row.time;
        onUpdate(row, newTime);
    };

    return (
        <Paper variant="outlined">
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Time</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell>{row.id}</TableCell>
                                <TableCell>{row.name}</TableCell>
                                <TableCell sx={{ minWidth: 150 }}>
                                    <TextField
                                        size="small"
                                        type="time"
                                        fullWidth
                                        value={editedTimes[row.id] ?? row.time}
                                        onChange={(e) => handleTimeChange(row.id, e.target.value)}
                                        inputProps={{ step: 1 }} // Enable seconds
                                    />
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        color="primary"
                                        onClick={() => handleUpdateClick(row)}
                                    >
                                        Update
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {data.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    No data available
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={count}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={onPageChange}
                onRowsPerPageChange={onRowsPerPageChange}
            />
        </Paper>
    );
}

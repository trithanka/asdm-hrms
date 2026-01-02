import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";

interface BankTransferData {
    id: number;
    employeeId: string;
    employeeName: string;
    accountNumber: string;
    ifscCode: string;
    transferAmount: number;
    status: string;
}

interface BankTransferTableProps {
    data: BankTransferData[];
}

export const BankTransferTable = ({ data }: BankTransferTableProps) => {
    return (
        <TableContainer component={Paper} sx={{ mt: 3 }}>
            <Table sx={{ minWidth: 650 }}>
                <TableHead>
                    <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                        <TableCell sx={{ fontWeight: 600 }}>Employee ID</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Employee Name</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Account Number</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>IFSC Code</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>
                            Transfer Amount
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row) => (
                        <TableRow
                            key={row.id}
                            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {row.employeeId}
                            </TableCell>
                            <TableCell>{row.employeeName}</TableCell>
                            <TableCell>{row.accountNumber}</TableCell>
                            <TableCell>{row.ifscCode}</TableCell>
                            <TableCell align="right">
                                ₹{row.transferAmount.toLocaleString()}
                            </TableCell>
                            <TableCell>
                                <Box
                                    component="span"
                                    sx={{
                                        px: 1.5,
                                        py: 0.5,
                                        borderRadius: 1,
                                        fontSize: "0.875rem",
                                        fontWeight: 500,
                                        backgroundColor:
                                            row.status === "Completed" ? "#e8f5e9" : "#fff3e0",
                                        color: row.status === "Completed" ? "#2e7d32" : "#e65100",
                                    }}
                                >
                                    {row.status}
                                </Box>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

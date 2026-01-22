import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";

interface TaxDeductionData {
    id: number;
    employeeId: string;
    employeeName: string;
    grossSalary: number;
    taxableIncome: number;
    tdsAmount: number;
    panNumber: string;
}

interface TaxDeductionTableProps {
    data: TaxDeductionData[];
}

export const TaxDeductionTable = ({ data }: TaxDeductionTableProps) => {
    return (
        <TableContainer component={Paper} sx={{ mt: 3, overflowX: "auto", overflowY: "auto", maxHeight: "calc(100vh - 380px)", width: "100%", maxWidth: "100%" }}>
            <Table sx={{ minWidth: 650 }} stickyHeader>
                <TableHead>
                    <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                        <TableCell sx={{ fontWeight: 600 }}>Employee ID</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Employee Name</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>PAN Number</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>
                            Gross Salary
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>
                            Taxable Income
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>
                            TDS Amount
                        </TableCell>
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
                            <TableCell>{row.panNumber}</TableCell>
                            <TableCell align="right">
                                ₹{row.grossSalary.toLocaleString()}
                            </TableCell>
                            <TableCell align="right">
                                ₹{row.taxableIncome.toLocaleString()}
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600, color: "#d32f2f" }}>
                                ₹{row.tdsAmount.toLocaleString()}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

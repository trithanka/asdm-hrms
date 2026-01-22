import { useState } from 'react';
import {
    Box,
    Typography,
    Stack,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Switch,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
    Tooltip,
    CircularProgress,
    Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { useGetFyMaster, useSaveFinancialYear, useToggleFinancialYear } from '../features/montly-salary-management/hooks/useFinancialYear';
import { formatToMediumDate } from '../utils/formatter';
import { FyMaster } from '../api/salary/salary-file-api';

const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
];

export default function FinancialYearPage() {
    const { data: fyData, isLoading, error } = useGetFyMaster();
    const saveMutation = useSaveFinancialYear();
    const toggleMutation = useToggleFinancialYear();

    const [open, setOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | undefined>(undefined);
    const [formData, setFormData] = useState({
        vsFy: '',
        iStartMonth: 4,
        bEnabled: 1,
    });

    const handleOpen = (fy?: any) => {
        if (fy) {
            setEditingId(fy.pklSalaryFinancialYearId);
            setFormData({
                vsFy: fy.vsFy,
                iStartMonth: fy.iStartMonth,
                bEnabled: fy.bEnabled,
            });
        } else {
            setEditingId(undefined);
            setFormData({
                vsFy: new Date().getFullYear().toString(),
                iStartMonth: 4,
                bEnabled: 1,
            });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = async () => {
        try {
            await saveMutation.mutateAsync({
                ...formData,
                pklSalaryFinancialYearId: editingId,
            });
            handleClose();
        } catch (e) {
            // Error is handled in hook toast
        }
    };

    const handleToggle = async (id: number) => {
        await toggleMutation.mutateAsync(id);
    };

    if (isLoading) {
        return (
            <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">Failed to load financial year data.</Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" fontWeight={600} color="primary.main">
                    Financial Year Management
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpen()}
                    sx={{ borderRadius: 2, px: 3 }}
                >
                    Add Financial Year
                </Button>
            </Box>

            <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <Table>
                    <TableHead sx={{ bgcolor: 'grey.100' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 600 }}>Financial Year</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Start Month</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Created At</TableCell>
                            <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {fyData?.data?.map((fy: FyMaster) => (
                            <TableRow key={fy.pklSalaryFinancialYearId} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell>
                                    <Typography variant="body2" fontWeight={600} color="secondary.main">
                                        {fy.vsFy}-{parseInt(fy.vsFy) + 1}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    {months.find(m => m.value === fy.iStartMonth)?.label || fy.iStartMonth}
                                </TableCell>
                                <TableCell>
                                    <Tooltip title={fy.bEnabled === 1 ? 'Disable' : 'Enable'}>
                                        <Switch
                                            checked={fy.bEnabled === 1}
                                            onChange={() => handleToggle(fy.pklSalaryFinancialYearId)}
                                            color="primary"
                                            disabled={toggleMutation.isPending}
                                        />
                                    </Tooltip>
                                </TableCell>
                                <TableCell>{formatToMediumDate(fy.dtCreatedAt)}</TableCell>
                                <TableCell align="right">
                                    <Tooltip title="Edit">
                                        <IconButton onClick={() => handleOpen(fy)} size="small" sx={{ color: 'primary.main', bgcolor: 'primary.light', '&:hover': { bgcolor: 'primary.main', color: 'white' } }}>
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
                <DialogTitle sx={{ fontWeight: 700 }}>{editingId ? 'Edit Financial Year' : 'Create Financial Year'}</DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
                        <Stack direction="row" spacing={2}>
                            <TextField
                                label="Start Year"
                                fullWidth
                                value={formData.vsFy}
                                onChange={(e) => setFormData({ ...formData, vsFy: e.target.value })}
                                placeholder="e.g. 2024"
                            />
                            <TextField
                                label="End Year"
                                fullWidth
                                value={formData.vsFy ? parseInt(formData.vsFy) + 1 : ''}
                                disabled
                                placeholder="e.g. 2025"
                            />
                        </Stack>
                        <FormControl fullWidth>
                            <InputLabel>Start Month</InputLabel>
                            <Select
                                label="Start Month"
                                value={formData.iStartMonth}
                                onChange={(e) => setFormData({ ...formData, iStartMonth: e.target.value as number })}
                            >
                                {months.map((m) => (
                                    <MenuItem key={m.value} value={m.value}>{m.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3, pt: 1 }}>
                    <Button onClick={handleClose} variant="outlined" sx={{ borderRadius: 2 }}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={saveMutation.isPending || !formData.vsFy}
                        sx={{ borderRadius: 2, px: 4 }}
                    >
                        {saveMutation.isPending ? 'Saving...' : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

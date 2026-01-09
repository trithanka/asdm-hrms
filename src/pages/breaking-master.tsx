import { useState } from 'react';
import {
    Box,
    Typography,
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
    CircularProgress,
    Alert,
    Grid,
    Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import {
    useSalaryBreakingMaster,
    useSaveSalaryBreakingMaster,
    useToggleSalaryBreakingMaster
} from '../features/montly-salary-management/hooks/useSalaryBreakingMaster';
import { useSalaryStructureTypes } from '../features/montly-salary-management/hooks/useGetSalaryFile';
import { formatFyMaster } from '../utils/formatter';
import { useMemo } from 'react';
import { Info } from '@mui/icons-material';

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

export default function BreakingMasterPage() {
    const { data: structureData } = useSalaryStructureTypes();
    const [selectedStructType, setSelectedStructType] = useState<string>('ASDM_NESC');
    const [selectedFyId, setSelectedFyId] = useState<string>('');

    const { data: listData, isLoading: isLoadingList, error: listError } = useSalaryBreakingMaster(selectedStructType, selectedFyId);
    // Removed fetchFilters dependency as we use designationCategory from structureData

    const saveMutation = useSaveSalaryBreakingMaster();
    const toggleMutation = useToggleSalaryBreakingMaster();

    const [open, setOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<number | undefined>(undefined);
    const [formData, setFormData] = useState<any>({
        fklDesignationCategoryId: '',
        dBasicPay: '',
        iWorkingDays: '',
        dIncrementParcentage: '',
        dHouseRentParcentage: '',
        dMobileInternet: '',
        dNewsPaperMagazine: '',
        dConveyanceAllowances: '',
        dEducationAllowance: '',
        dArrear: '',
        dDeductionOfPtax: '',
        dDeductionOfIncomeTax: '',
        dOtherDeduction: '',
        bEnabled: 1,
        fklSalaryFinancialYearId: '',
    });

    const formattedFyList = useMemo(() => {
        if (!structureData?.data?.fyMaster) return [];
        const formatted = formatFyMaster(structureData.data.fyMaster);

        // Auto-select latest enabled FY if nothing is selected
        if (formatted.length > 0 && !selectedFyId) {
            const latestEnabled = structureData.data.fyMaster.find(f => f.bEnabled === 1);
            if (latestEnabled) {
                setSelectedFyId(latestEnabled.pklSalaryFinancialYearId.toString());
            } else {
                setSelectedFyId(formatted[formatted.length - 1].id.toString());
            }
        }
        return formatted;
    }, [structureData, selectedFyId]);

    const filteredDesignationCategories = useMemo(() => {
        if (!structureData?.data?.designationCategory) return [];

        // Map string types to numeric IDs based on backend logic
        // ASDM_NESC -> 1, Casual -> 2, Part_Time -> 3, AMD -> 4 (Inferred from payload)
        const structTypeMapping: Record<string, number> = {
            'ASDM_NESC': 1,
            'Casual': 2,
            'Part_Time': 3,
            'AMD': 4
        };
        const structId = structTypeMapping[selectedStructType];

        return structureData.data.designationCategory.filter(cat => cat.fklSlarayStructureTypeId === structId);
    }, [structureData, selectedStructType]);


    const handleOpen = (item?: any) => {
        if (item) {
            setEditingId(item.pklSalaryBreakingAsdmNescId);
            setIsEditing(false); // Start in view mode
            setFormData({
                fklDesignationCategoryId: item.fklDesignationCategoryId?.toString() || '',
                dBasicPay: item.dBasicPay ?? '',
                iWorkingDays: item.iWorkingDays ?? '',
                dIncrementParcentage: item.dIncrementParcentage ?? '',
                dHouseRentParcentage: item.dHouseRentParcentage ?? '',
                dMobileInternet: item.dMobileInternet ?? '',
                dNewsPaperMagazine: item.dNewsPaperMagazine ?? '',
                dConveyanceAllowances: item.dConveyanceAllowances ?? '',
                dEducationAllowance: item.dEducationAllowance ?? '',
                dArrear: item.dArrear ?? '',
                dDeductionOfPtax: item.dDeductionOfPtax ?? '',
                dDeductionOfIncomeTax: item.dDeductionOfIncomeTax ?? '',
                dOtherDeduction: item.dOtherDeduction ?? '',
                bEnabled: item.bEnabled || 1,
                fklSalaryFinancialYearId: item.fklSalaryFinancialYearId?.toString() || '',
            });
        } else {
            setEditingId(undefined);
            setIsEditing(true); // Start in edit mode for new records
            setFormData({
                fklDesignationCategoryId: '',
                dBasicPay: '',
                iWorkingDays: '',
                dIncrementParcentage: '',
                dHouseRentParcentage: '',
                dMobileInternet: '',
                dNewsPaperMagazine: '',
                dConveyanceAllowances: '',
                dEducationAllowance: '',
                dArrear: '',
                dDeductionOfPtax: '',
                dDeductionOfIncomeTax: '',
                dOtherDeduction: '',
                bEnabled: 1,
                fklSalaryFinancialYearId: selectedFyId !== 'all' ? selectedFyId : '',
            });
        }
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const handleSubmit = async () => {
        try {
            // Clean payload: Remove empty strings and convert others to numbers where needed
            const payload: any = { ...formData, pklSalaryBreakingAsdmNescId: editingId };
            Object.keys(payload).forEach(key => {
                if (payload[key] === '') {
                    delete payload[key];
                } else if (key.startsWith('d') || key.startsWith('i') || key === 'fklSalaryFinancialYearId') {
                    payload[key] = Number(payload[key]);
                }
            });

            await saveMutation.mutateAsync(payload);
            handleClose();
        } catch (e) { }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, gap: 2 }}>
                <Typography variant="h5" fontWeight={600} color="primary">Salary Breaking Master</Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <FormControl size="small" sx={{ minWidth: 200 }}>
                        <InputLabel>Structure Type</InputLabel>
                        <Select
                            value={selectedStructType}
                            label="Structure Type"
                            onChange={(e) => setSelectedStructType(e.target.value)}
                        >
                            {structureData?.data?.salaryStructureTypes?.map((type) => (
                                <MenuItem key={type.type} value={type.type}>
                                    {type.type.replace(/_/g, ' ')}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl size="small" sx={{ minWidth: 200 }}>
                        <InputLabel>Financial Year</InputLabel>
                        <Select
                            value={selectedFyId}
                            label="Financial Year"
                            onChange={(e) => setSelectedFyId(e.target.value)}
                        >
                            <MenuItem value="all">All Years</MenuItem>
                            {formattedFyList.map((fy) => (
                                <MenuItem key={fy.id} value={fy.id.toString()}>
                                    {fy.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()} sx={{ borderRadius: 2 }}>
                        Add Record
                    </Button>
                </Box>
            </Box>

            {isLoadingList ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress />
                </Box>
            ) : (listError || listData?.status === "error") ? (
                <Box sx={{ mt: 4 }}>
                    <Alert severity="info" sx={{ borderRadius: 2 }}>
                        {listData?.message || "Failed to load breaking master data. Please select another structure type."}
                    </Alert>
                </Box>
            ) : (
                <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                    <Table size="small">
                        <TableHead sx={{ bgcolor: 'grey.100' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 600 }}>Designation Category</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Financial Year</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Start Month</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Basic Pay</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Days</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {listData?.data?.map((item: any) => (
                                <TableRow key={item.pklSalaryBreakingAsdmNescId} hover>
                                    <TableCell>
                                        {item.vsDesignationCategoryName || structureData?.data?.designationCategory?.find(d => d.pklDesignationCategoryId === item.fklDesignationCategoryId)?.vsDesignationCategoryName || item.fklDesignationCategoryId}
                                    </TableCell>
                                    <TableCell>
                                        {formattedFyList.find(f => f.id === (item.finalcialYearId || item.fklSalaryFinancialYearId))?.label || (
                                            item.finacialYear
                                                ? `${item.finacialYear}-${parseInt(item.finacialYear) + 1}`
                                                : item.fklSalaryFinancialYearId
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {months.find(m => m.value === item.finacialYearMonth)?.label || item.finacialYearMonth || (
                                            months.find(m => m.value === structureData?.data?.fyMaster?.find(fy => fy.pklSalaryFinancialYearId === item.fklSalaryFinancialYearId)?.iStartMonth)?.label || 'N/A'
                                        )}
                                    </TableCell>
                                    <TableCell>{item.dBasicPay}</TableCell>
                                    <TableCell>{item.iWorkingDays}</TableCell>
                                    <TableCell>
                                        <Switch
                                            checked={item.bEnabled === 1}
                                            onChange={() => toggleMutation.mutate(item.pklSalaryBreakingAsdmNescId)}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="View/Edit Details">
                                            <IconButton onClick={() => handleOpen(item)} color="secondary" size="small">
                                                <Info fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle sx={{ fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {editingId ? (isEditing ? 'Edit Breaking Master' : 'Breaking Master Details') : 'Add Breaking Master'}
                    </Typography>
                    {editingId && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" color="text.secondary">Edit Mode</Typography>
                            <Switch
                                size="small"
                                checked={isEditing}
                                onChange={(e) => setIsEditing(e.target.checked)}
                            />
                        </Box>
                    )}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth disabled={!isEditing}>
                                <InputLabel>Designation Category</InputLabel>
                                <Select
                                    value={formData.fklDesignationCategoryId}
                                    label="Designation Category"
                                    onChange={(e) => setFormData({ ...formData, fklDesignationCategoryId: e.target.value })}
                                >
                                    {filteredDesignationCategories.map((d) => (
                                        <MenuItem key={d.pklDesignationCategoryId} value={d.pklDesignationCategoryId.toString()}>{d.vsDesignationCategoryName}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth disabled={!isEditing}>
                                <InputLabel>Financial Year</InputLabel>
                                <Select
                                    value={formData.fklSalaryFinancialYearId}
                                    label="Financial Year"
                                    onChange={(e) => setFormData({ ...formData, fklSalaryFinancialYearId: e.target.value })}
                                >
                                    {formattedFyList.map((fy) => (
                                        <MenuItem key={fy.id} value={fy.id.toString()}>
                                            {fy.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Basic Pay"
                                type="number"
                                value={formData.dBasicPay}
                                onChange={(e) => setFormData({ ...formData, dBasicPay: e.target.value })}
                                InputProps={{ readOnly: !isEditing }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField fullWidth label="Working Days" type="number" value={formData.iWorkingDays} onChange={(e) => setFormData({ ...formData, iWorkingDays: e.target.value })} InputProps={{ readOnly: !isEditing }} />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField fullWidth label="Increment %" type="number" value={formData.dIncrementParcentage} onChange={(e) => setFormData({ ...formData, dIncrementParcentage: e.target.value })} InputProps={{ readOnly: !isEditing }} />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField fullWidth label="HRA %" type="number" value={formData.dHouseRentParcentage} onChange={(e) => setFormData({ ...formData, dHouseRentParcentage: e.target.value })} InputProps={{ readOnly: !isEditing }} />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField fullWidth label="Mobile/Internet" type="number" value={formData.dMobileInternet} onChange={(e) => setFormData({ ...formData, dMobileInternet: e.target.value })} InputProps={{ readOnly: !isEditing }} />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField fullWidth label="Newspaper/Mag" type="number" value={formData.dNewsPaperMagazine} onChange={(e) => setFormData({ ...formData, dNewsPaperMagazine: e.target.value })} InputProps={{ readOnly: !isEditing }} />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField fullWidth label="Conveyance" type="number" value={formData.dConveyanceAllowances} onChange={(e) => setFormData({ ...formData, dConveyanceAllowances: e.target.value })} InputProps={{ readOnly: !isEditing }} />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField fullWidth label="Education" type="number" value={formData.dEducationAllowance} onChange={(e) => setFormData({ ...formData, dEducationAllowance: e.target.value })} InputProps={{ readOnly: !isEditing }} />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField fullWidth label="Arrear" type="number" value={formData.dArrear} onChange={(e) => setFormData({ ...formData, dArrear: e.target.value })} InputProps={{ readOnly: !isEditing }} />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField fullWidth label="P-Tax" type="number" value={formData.dDeductionOfPtax} onChange={(e) => setFormData({ ...formData, dDeductionOfPtax: e.target.value })} InputProps={{ readOnly: !isEditing }} />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField fullWidth label="Income Tax" type="number" value={formData.dDeductionOfIncomeTax} onChange={(e) => setFormData({ ...formData, dDeductionOfIncomeTax: e.target.value })} InputProps={{ readOnly: !isEditing }} />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField fullWidth label="Other Deduction" type="number" value={formData.dOtherDeduction} onChange={(e) => setFormData({ ...formData, dOtherDeduction: e.target.value })} InputProps={{ readOnly: !isEditing }} />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={handleClose}>Close</Button>
                    {isEditing && (
                        <Button variant="contained" onClick={handleSubmit} disabled={saveMutation.isPending}>
                            {saveMutation.isPending ? 'Saving...' : 'Save'}
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </Box>
    );
}

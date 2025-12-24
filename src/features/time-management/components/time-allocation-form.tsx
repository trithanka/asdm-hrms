import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    TextField,
} from "@mui/material";
import { useState } from "react";
import { ITimeAllocation } from "../types";

interface ITimeAllocationForm {
    initialData?: ITimeAllocation | null;
    onCancel?: () => void;
    onSubmit: (data: Partial<ITimeAllocation>) => void;
}

export default function TimeAllocationForm({
    initialData,
    onCancel,
    onSubmit,
}: ITimeAllocationForm) {
    const [formData, setFormData] = useState<Partial<ITimeAllocation>>(
        initialData || {
            name: "",
            time: "",
            type: "attendance",
            timeType: "In Time",
        }
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Paper variant="outlined" sx={{ p: 3, maxWidth: 600 }}>
            <form onSubmit={handleSubmit}>
                <Stack spacing={3}>
                    <TextField
                        label="Name"
                        variant="outlined"
                        fullWidth
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        helperText="e.g. checkIn, gracePeriod"
                        required
                    />

                    <TextField
                        label="Time"
                        type="time" // Simple time input, or text if specific format needed
                        variant="outlined"
                        fullWidth
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ step: 1 }} // Enable seconds
                        required
                    />

                    <FormControl fullWidth>
                        <InputLabel>Time Type</InputLabel>
                        <Select
                            value={formData.timeType}
                            label="Time Type"
                            onChange={(e) =>
                                setFormData({ ...formData, timeType: e.target.value as string })
                            }
                        >
                            <MenuItem value="In Time">In Time (Time of Day)</MenuItem>
                            <MenuItem value="In Hour">In Hour (Duration)</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl fullWidth>
                        <InputLabel>Type</InputLabel>
                        <Select
                            value={formData.type}
                            label="Type"
                            onChange={(e) =>
                                setFormData({ ...formData, type: e.target.value as string })
                            }
                        >
                            <MenuItem value="attendance">Attendance</MenuItem>
                            <MenuItem value="leave">Leave</MenuItem>
                            <MenuItem value="other">Other</MenuItem>
                        </Select>
                    </FormControl>

                    <Box display="flex" gap={2} justifyContent="flex-end">
                        {onCancel && (
                            <Button variant="outlined" color="inherit" onClick={onCancel}>
                                Cancel
                            </Button>
                        )}
                        <Button type="submit" variant="contained" color="primary">
                            {initialData ? "Update Allocation" : "Add Allocation"}
                        </Button>
                    </Box>
                </Stack>
            </form>
        </Paper>
    );
}

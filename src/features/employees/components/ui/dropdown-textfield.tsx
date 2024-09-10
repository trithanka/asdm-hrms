import { Box, Stack, Typography } from "@mui/material";
import { Control } from "react-hook-form";
import Input from "../../../../components/ui/input";
import Select, { IOption } from "../../../../components/ui/select";

interface Props {
  label: string;
  valueName: string;
  optionName: string;
  options: IOption[];
  control: Control | unknown;
  fullWidth?: boolean;
  disabled?: boolean;
  required?: boolean;
}

export default function DropdownTextfield({
  label,
  control,
  optionName,
  valueName,
  options,
  disabled,
  required = false,
}: Props) {
  return (
    <Box width="100%">
      <Typography variant="caption" fontWeight={500}>
        {label} {required && <span style={{ color: "red" }}>*</span>}
      </Typography>
      <Stack
        direction="row"
        gap={1}
        justifyContent="stretch"
        alignItems="center"
        width="100%"
        mt={-1.3}
      >
        <Box display={"flex"} gap={1} mt={1.5} width={"100%"}>
          <div style={{ width: "50%" }}>
            <Select
              control={control}
              name={optionName}
              options={options}
              disabled={disabled}
            />
          </div>
          <div style={{ width: "50%" }}>
            <Input
              control={control}
              name={valueName}
              placeholder=""
              fullWidth
            />
          </div>
        </Box>
      </Stack>
    </Box>
  );
}

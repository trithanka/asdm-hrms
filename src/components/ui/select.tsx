import { MenuItem, Select as MuiSelect } from "@mui/material";
import Typography from "@mui/material/Typography";
import { Control, Controller, FieldValues } from "react-hook-form";

export interface IOption {
  value: string | number;
  label: string;
}

interface InputProps {
  label?: string;
  name: string;
  control: Control | unknown;
  fullWidth?: boolean;
  disabled?: boolean;
  options: IOption[];
  required?: boolean;
}

export default function Select({
  label,
  control,
  name,
  fullWidth = true,
  disabled = false,
  options,
  required = false,
}: InputProps) {

  return (
    <div style={ { width: "100%" } }>
      { label && (
        <Typography variant="caption" fontWeight={ 500 } gutterBottom>
          { label } { required && <span style={ { color: "red" } }>*</span> }
        </Typography>
      ) }

      <Controller
        control={ control as Control<FieldValues> }
        name={ name }
        render={ ({ field: { onChange, value }, fieldState: { error } }) => (
          <>
            {/* {value !== "" && (
              <InputLabel
                style={{
                  marginLeft: "0.71em",
                  marginTop: "1em",
                  paddingLeft: "0.44em",
                  paddingRight: "0.44em",
                  zIndex: 2,
                  backgroundColor: "white",
                  position: "absolute",
                  fontSize: "0.75em",
                }}
              >
                Select {name}
              </InputLabel>
            )} */}
            <MuiSelect
              key={ value }
              size="small"
              onChange={ (e) => {
                if (e.target.value === "none") return;

                onChange(e);
              } }
              value={ value }
              disabled={ disabled }
              fullWidth={ fullWidth }
              error={ !!error?.message }
              defaultValue={ "none" }
            >
              <MenuItem selected disabled value={ "none" } sx={ { textTransform: "capitalize" } }>
                Select { name }
              </MenuItem>
              { options.map((option, idx: number) => (
                <MenuItem key={ idx } value={ option.value }>
                  { option.label }
                </MenuItem>
              )) }
            </MuiSelect>
          </>
        ) }
      />
    </div>
  );
}

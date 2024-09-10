import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Control, Controller, FieldValues } from "react-hook-form";

interface InputProps {
  label?: string;
  name: string;
  placeholder: string;
  autoFocus?: boolean;
  type?: "text" | "password" | "number" | "date";
  control?: Control | unknown;
  autoComplete?: string | undefined;
  fullWidth?: boolean;
  multiline?: boolean;
  disabled?: boolean;
  inputLength?: number;
  required?: boolean;
  maxDate?: string;
}

export default function Input({
  label,
  placeholder,
  control,
  autoFocus = false,
  type = "text",
  name,
  autoComplete = "true",
  fullWidth = true,
  multiline = false,
  disabled = false,
  inputLength = 10,
  required = false,
  maxDate,
}: InputProps) {

  return (
    <div>
      { label && (
        <Typography variant="caption" fontWeight={ 500 } gutterBottom>
          { label } { required && <span style={ { color: "red" } }>*</span> }
        </Typography>
      ) }
      <Controller
        control={ control as Control<FieldValues> }
        name={ name }
        render={ ({ field: { onChange, value }, fieldState: { error } }) => (
          <TextField
            size="small"
            error={ !!error?.message }
            fullWidth={ fullWidth }
            onChange={ (e) => {
              if (type === "number") {
                if (e.target.value.length > (inputLength || 10)) return;

                onChange(e);
              } else {
                onChange(e);
              }
            } }
            helperText={ error ? error.message : null }
            placeholder={ placeholder }
            autoFocus={ autoFocus }
            type={ type }
            autoComplete={ autoComplete }
            multiline={ multiline }
            minRows={ multiline ? 3 : undefined }
            disabled={ disabled }
            value={ value }
            InputProps={ {
              inputProps: {
                max: type == "date" && maxDate ? maxDate : undefined,
              }
            } }
          />
        ) }
      />
    </div>
  );
}

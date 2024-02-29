import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { TextField } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import { useState } from "react";
import { FieldError } from "react-hook-form";
interface formProps {
  name: string;
  label?: string;
  register: (any: any) => any;
  error: FieldError | undefined;
}

const InputPassword: React.FC<formProps> = ({
  name,
  register,
  error,
  label,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <>
      <TextField
        label={label || name}
        variant="outlined"
        name={name}
        helperText={error?.message}
        error={!!error}
        FormHelperTextProps={{ id: "password-helper-id" }}
        type={showPassword ? "text" : "password"}
        {...register(name)}
        {...error}
        InputProps={{
          // <-- This is where the toggle button is added.
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="mudar visibilidade da senha"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </>
  );
};
export default InputPassword;

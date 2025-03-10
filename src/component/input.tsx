import { FormControl, InputLabel, Select, TextField } from "@mui/material";
import { Controller } from "react-hook-form";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from "dayjs";
import { Box } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import { InputAdornment } from "@mui/material";
import { ClearIcon } from "@mui/x-date-pickers/icons";
import { FormHelperText, Typography } from "@mui/material"

/**
 * This file contains a collection of reusable UI components for form inputs.
 * It includes a Controller component that wraps the react-hook-form Controller
 * component, and provides some additional features such as:
 * - A clear button to clear the input
 * - A label that displays the input's label
 * - Support for required fields
 * - Support for displaying error messages
 * 
 * The components are designed to be used with the react-hook-form library.
 * 
 * The main component is the CInput component, which is a wrapper around the 
 * TextField component from @mui/material. It provides the additional features
 * mentioned above.
 * 
 * The CDateTimePicker component is a wrapper around the DateTimePicker component
 * from @mui/x-date-pickers. It provides the same additional features as the 
 * CInput component.
 * 
 * The CSelect component is a wrapper around the Select component from 
 * @mui/material. It provides the same additional features as the CInput component.
 * 
 */

export const getLabel = (label: string, required: boolean | undefined) => {
    return required ? (<Typography component={"span"}>{label}<Typography component={"span"} style={{ color: "red" }}> *</Typography></Typography>) : label
}

export const getError = (error: any) => {
    if (!error) {
        return
    }
    return <FormHelperText error>{error.message}</FormHelperText>
}

type CInputSizeProps = "small" | "medium"
interface ICInput {
    disabled?: boolean
    multiline?: number
    required?: boolean
    type?: string
    fullWidth?: boolean
    control: any
    onChange?: any
    defaultValue?: any
    touched?: any
    placeholder?: any
    variant?: any
    rules?: any
    name: string
    size?: CInputSizeProps
    label: string
    errors?: any
    error?: any
    id?: string
    min?: number | Date
    max?: number | Date
    textAlign?: "left" | "center" | "right";
}

interface ICDatePicker extends ICInput {
    format?: string
    min?: Date
    max?: Date
}

interface ICSelect extends ICInput {
    children?: any
}


export const CInput = (props: ICInput) => {
    const { control, error, disabled, min, max, textAlign = "left", multiline, type, size, errors, onChange, fullWidth, required, variant, id, placeholder, label, name, defaultValue, rules } = props;
    return <Box pt={0.5}>
        <FormControl fullWidth={fullWidth} size={size ?? "small"}>
            <Controller
                control={control}
                name={name}
                defaultValue={defaultValue}
                rules={{ ...rules, ...(required ? { required: `${label} is required` } : {}) }}
                render={({ field }) => {
                    return (
                        <TextField
                            {...field}
                            multiline={Boolean(multiline)}
                            rows={multiline}
                            type={type ?? "text"}
                            onChange={(e) => {
                                onChange ? onChange(e, field) : field.onChange(e);
                            }}
                            disabled={disabled}
                            InputLabelProps={{
                                shrink: !!field.value
                            }}
                            variant={variant ?? "outlined"}
                            id={id ?? `${name}-id`}
                            label={getLabel(label, required)}
                            size={size ?? "small"}
                            placeholder={placeholder}
                            InputProps={{
                                inputProps: {
                                    maxLength: max,
                                    minLength: min,
                                    sx: { textAlign: textAlign }
                                }
                            }}
                        />
                    );
                }}
            />
            {getError(error ?? errors?.[name])}
        </FormControl >
    </Box>
}

export const CSelect = (props: ICSelect) => {
    const { control, errors, error, disabled, size, fullWidth, required, children, variant, id, label, name, defaultValue, rules } = props;
    return <Box pt={0.5}>
        <FormControl fullWidth={fullWidth} size={size ?? "small"}>
            <Controller
                control={control}
                name={name}
                rules={{ ...rules, ...(required ? { required: `${label} is required` } : {}) }}
                render={({ field }) => {
                    return (
                        <>
                            <InputLabel id={`label-id-${name}`}>{getLabel(label, required)}</InputLabel>
                            <Select
                                {...field}
                                value={field.value !== undefined ? field.value : ''}
                                disabled={disabled}
                                labelId={`label-id-${name}`}
                                variant={variant ?? "outlined"}
                                id={id ?? `${name}-id`}
                                label={getLabel(label, required)}
                                endAdornment={
                                    (Boolean(field.value ?? defaultValue)) && (
                                        <InputAdornment sx={{ position: "absolute", right: 32 }} position="end">
                                            <IconButton
                                                size="small"
                                                onClick={() => {
                                                    field.onChange(undefined);
                                                }}
                                            >
                                                <ClearIcon fontSize="small"></ClearIcon>
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }
                            >
                                {children}
                            </Select>
                        </>
                    );
                }}
            />
            {getError(error ?? errors?.[name])}
        </FormControl>
    </Box>
}


export const CDateTimePicker = (props: ICDatePicker) => {
    const { control, errors, error, fullWidth, size, disabled, required, format, label, name, defaultValue, rules } = props;
    return <Box>
        <FormControl className="test" fullWidth={fullWidth} size={size ?? "small"}>
            <Controller
                control={control}
                name={name}
                defaultValue={defaultValue}
                rules={{ ...rules, ...(required ? { required: `${label} is required` } : {}) }}
                render={({ field }) => {
                    return (
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DateTimePicker']} sx={{ paddingTop: 0.5 }}>
                                <DateTimePicker
                                    {...field}
                                    disabled={disabled}
                                    sx={{ width: "100%" }}
                                    value={field.value ? dayjs(field.value) : null}
                                    onChange={(e) => {
                                        field.onChange({
                                            name,
                                            target: {
                                                value: e ? e.toISOString() : ''
                                            }
                                        });
                                    }}
                                    format={format ?? "YYYY-MM-DD hh:mm a"}
                                    label={getLabel(label, required)}
                                    slotProps={{
                                        textField: {
                                            size: size ?? "small",
                                            sx: { minWidth: "auto !important", width: "100%" }
                                        },
                                    }}
                                />
                            </DemoContainer>
                        </LocalizationProvider>
                    );
                }}
            />
            {getError(error ?? errors?.[name])}
        </FormControl>
    </Box>
}

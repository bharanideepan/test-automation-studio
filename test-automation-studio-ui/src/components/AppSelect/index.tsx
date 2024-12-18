import React from "react";
import PropTypes from "prop-types";
import {
  Select,
  MenuItem,
  SelectChangeEvent,
  InputLabel,
  FormControl,
  Typography,
  ListSubheader,
} from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  select: {
    "&.MuiInputBase-root": {
      height: 38,
      fontSize: 12,
      lineHeight: "16px",
      // border: `0.5px solid ${theme.palette.primary.main}`,
    },
    "& fieldset": {
      // border: "none",
    },
  },
  label: {
    // top: "unset !important",
    // bottom: "20px",
  },
  labelFilled: {
    // top: "0",
    // bottom: "15px !important",
  },
}));

export const AppSelect: React.FC<{
  value: string;
  options: { label: string; value: string }[];
  onChange: (event: SelectChangeEvent<string>) => void;
  disabled?: boolean;
  label?: string;
  id: string;
  error?: boolean;
  helperText?: string;
}> = ({ value, options, onChange, disabled, label, id, error, helperText }) => {
  const classes = useStyles();
  return (
    <FormControl sx={{ width: "100%" }}>
      {label && (
        <InputLabel
          classes={{
            root: classes.label,
            focused: classes.labelFilled,
            filled: classes.labelFilled,
          }}
          id={id}
        >
          <Typography color={error ? "error" : ""}>{label}</Typography>
        </InputLabel>
      )}
      <Select
        labelId={id}
        value={value}
        onChange={onChange}
        className={classes.select}
        disabled={disabled}
        inputProps={{
          "data-testid": `${id}-test-id`,
        }}
        sx={{ display: "flex" }}
        error={error}
      >
        {options.map((option, index) => (
          <MenuItem key={index} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {helperText && <Typography color={"error"} mt={"3px"} mx={"14px"}>{helperText}</Typography>}
    </FormControl>
  );
};

export const AppGroupSelect: React.FC<{
  value: string;
  options: { category: string; options: { label: string; value: string }[] }[];
  onChange: (event: SelectChangeEvent<string>) => void;
  disabled?: boolean;
  label?: string;
  id: string;
  error?: boolean;
  helperText?: string;
}> = ({ value, options, onChange, disabled, label, id, error, helperText }) => {
  const classes = useStyles();

  const getOptions = () => {
    const accumulator: { type: string; value?: string; label: string }[] = [];
    return options.reduce((acc, val) => {
      const { category, options } = val;
      acc.push({ type: 'category', label: category })
      options.map((option) => {
        acc.push({ type: 'option', ...option })
      })
      return acc;
    }, accumulator)
  }

  const renderOption = (option: { type: string; label: string; value?: string }, index: number) => {
    return option.type === "category"
      ? <ListSubheader key={index}>{option.label}</ListSubheader>
      : <MenuItem key={index} value={option.value}>{option.label}</MenuItem>
  }
  return (
    <FormControl sx={{ width: "100%" }}>
      {label && (
        <InputLabel
          classes={{
            root: classes.label,
            focused: classes.labelFilled,
            filled: classes.labelFilled,
          }}
          id={id}
        >
          <Typography color={error ? "error" : ""}>{label}</Typography>
        </InputLabel>
      )}
      <Select
        labelId={id}
        value={value}
        onChange={onChange}
        className={classes.select}
        disabled={disabled}
        inputProps={{
          "data-testid": `${id}-test-id`,
        }}
        sx={{ display: "flex" }}
        error={error}
      >
        {getOptions().map((option, index) => {
          return renderOption(option, index)
        })}
      </Select>
      {helperText && <Typography color={"error"} mt={"3px"} mx={"14px"}>{helperText}</Typography>}
    </FormControl>
  );
};

AppSelect.propTypes = {
  value: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }).isRequired
  ).isRequired,
  disabled: PropTypes.bool,
  label: PropTypes.string,
  id: PropTypes.string.isRequired,
};

AppSelect.defaultProps = {
  disabled: false,
};

export default AppSelect;

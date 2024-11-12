import React from "react";
import PropTypes from "prop-types";
import {
  Select,
  MenuItem,
  SelectChangeEvent,
  InputLabel,
  FormControl,
} from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  select: {
    "&.MuiInputBase-root": {
      height: 28,
      fontSize: 12,
      lineHeight: "16px",
      border: `0.5px solid ${theme.palette.primary.main}`,
    },
    "& fieldset": {
      border: "none",
    },
  },
  label: {
    top: "unset !important",
    bottom: "20px",
  },
  labelFilled: {
    top: "0",
    bottom: "15px !important",
  },
}));

const AppSelect: React.FC<{
  value: string;
  options: { label: string; value: string }[];
  onChange: (event: SelectChangeEvent<string>) => void;
  disabled?: boolean;
  label?: string;
  id: string;
}> = ({ value, options, onChange, disabled, label, id }) => {
  const classes = useStyles();
  return (
    <FormControl sx={{ m: 1, minWidth: 120 }}>
      {label && (
        <InputLabel
          classes={{
            root: classes.label,
            focused: classes.labelFilled,
            filled: classes.labelFilled,
          }}
          id={id}
        >
          {label}
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
      >
        {options.map((option, index) => (
          <MenuItem key={index} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

const useStyles2 = makeStyles((theme) => ({
  select: {
    "&.MuiInputBase-root": {
      fontSize: 12,
    },
  },
}));

export const AppSelect2: React.FC<{
  value: string;
  options: { label: string; value: string }[];
  onChange: (event: SelectChangeEvent<string>) => void;
  disabled?: boolean;
  label?: string;
  id: string;
}> = ({ value, options, onChange, disabled, label, id }) => {
  const classes = useStyles2();
  return (
    <>
      {label && (
        <InputLabel
          id={id}
        >
          {label}
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
        sx={{display:"flex"}}
      >
        {options.map((option, index) => (
          <MenuItem key={index} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </>
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

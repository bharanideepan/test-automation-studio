import * as React from 'react';
import { Theme, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import { makeStyles } from "@mui/styles";

const MenuProps = {
    PaperProps: {
        style: {
            // width: 250,
        },
    },
};

const useStyles = makeStyles((theme) => ({
    chip: {
        "&.MuiChip-root": {
            height: 24,
            fontSize: 12,
            lineHeight: "16px",
            padding: 0
            // overflow: "auto"
            // border: `0.5px solid ${theme.palette.primary.main}`,
        },
    },
    select: {
        "&.MuiInputBase-root": {
            // height: 38,
            fontSize: 12,
            lineHeight: "16px",
            padding: 0
            // overflow: "auto"
            // border: `0.5px solid ${theme.palette.primary.main}`,
        },
        "& fieldset": {
            // border: "none",
        },
        "& #multiple-chip": {
            padding: 11
        }
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

function getStyles(value: string, personName: readonly string[], theme: Theme) {
    return {
        fontWeight: personName.includes(value)
            ? theme.typography.fontWeightMedium
            : theme.typography.fontWeightRegular,
    };
}

const MultipleSelectChip: React.FC<{
    label: string;
    options: { label: string; value: string }[];
    selected: string[] | undefined;
    setSelected: (value: string[]) => void;
}> = ({ label, options, selected, setSelected }) => {
    const theme = useTheme();
    const classes = useStyles();

    const handleChange = (event: SelectChangeEvent<string[]>) => {
        const { target: { value } } = event;
        setSelected(typeof value === 'string' ? value.split(',') : value);
    };

    const handleDelete = (value: string) => {
        console.log(value)
    }

    return (
        <div>
            <FormControl sx={{ width: 360 }}>
                <InputLabel
                    classes={{
                        root: classes.label,
                        focused: classes.labelFilled,
                        filled: classes.labelFilled,
                    }} id="multiple-chip-label">{label}</InputLabel>
                <Select
                    sx={{
                        padding: '0px !important'
                    }}
                    labelId="multiple-chip-label"
                    id="multiple-chip"
                    multiple
                    value={selected}
                    onChange={handleChange}
                    input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                    renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => (
                                <Chip className={classes.chip} key={value} label={options.find((option) => option.value === value)?.label ?? value} />
                            ))}
                        </Box>
                    )}
                    MenuProps={MenuProps}
                    className={classes.select}
                >
                    {options.map(({ label, value }, index) => (
                        <MenuItem
                            key={index}
                            value={value}
                            style={getStyles(value, selected ?? [], theme)}
                        >
                            {label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}

export default MultipleSelectChip;
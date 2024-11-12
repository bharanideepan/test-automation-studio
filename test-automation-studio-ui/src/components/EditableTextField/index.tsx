import React, { useState, useEffect, MouseEvent, ChangeEvent } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { Box, InputBase, IconButton, Divider, Typography } from "@mui/material";
import EditIcon from "../../assets/images/edit-icon.svg";
import TickIcon from "../../assets/images/tick-icon-green.svg";
import CancelIcon from "../../assets/images/cancel-icon-grey.svg";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  inputContainer: {
    borderBottom: `1px dashed ${theme.palette.primary.main}`,
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(0.25),
    paddingBottom: theme.spacing(0.5),
    maxWidth: 400,
  },
  input: {
    fontWeight: "700 !important",
    fontSize: "14px !important",
    letterSpacing: "-0.04em !important",
    lineHeight: "1 !important",
    "& input": {
      padding: "0 !important",
    },
  },
}));

const EditableTextField: React.FC<{
  className?: string;
  value: string;
  onSubmit: (value: string) => void;
}> = ({ className, value, onSubmit }) => {
  const classes = useStyles();
  const [text, setText] = useState(value);
  const [editMode, setEditMode] = useState(false);
  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setText(event.target.value);
  };
  const handleEdit = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setEditMode(true);
  };
  const handleCancel = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setText(value);
    setEditMode(false);
  };
  const handleSubmit = (
    event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    event.preventDefault();
    event.stopPropagation();
    setEditMode(false);
    onSubmit(text);
  };

  useEffect(() => {
    setText(value);
  }, [value, setText]);

  return (
    <div>
      {!editMode && (
        <Box display="flex" alignItems="center" gap={0.25}>
          <Typography
            color="primaryHighlight.main"
            className={clsx(classes.input, className)}
          >
            {text}
          </Typography>
          <IconButton sx={{ p: "2px" }} aria-label="edit" onClick={handleEdit}>
            <img src={EditIcon} alt="edit" width="18" height="18" />
          </IconButton>
        </Box>
      )}
      {editMode && (
        <Box component="form" className={classes.inputContainer}>
          <InputBase
            sx={{ flex: 1 }}
            placeholder="Enter name"
            inputProps={{ "aria-label": "Enter name" }}
            value={text}
            className={clsx(classes.input, className)}
            autoFocus
            onChange={handleChange}
          />
          <Divider sx={{ height: 12, mx: 1.25 }} orientation="vertical" />
          <IconButton
            type="button"
            sx={{ p: "2px" }}
            aria-label="cancel"
            onClick={handleCancel}
          >
            <img src={CancelIcon} alt="cancel" width="18" height="18" />
          </IconButton>
          <IconButton
            type="submit"
            sx={{ p: "2px" }}
            aria-label="submit"
            onClick={handleSubmit}
          >
            <img src={TickIcon} alt="submit" width="18" height="18" />
          </IconButton>
        </Box>
      )}
    </div>
  );
};

EditableTextField.propTypes = {
  value: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default EditableTextField;

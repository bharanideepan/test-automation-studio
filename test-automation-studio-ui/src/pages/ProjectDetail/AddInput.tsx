import React, { useState, ChangeEvent, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Typography, Button, Box, Tooltip, TextField, IconButton, SelectChangeEvent, Select, MenuItem, InputLabel } from "@mui/material";
import AddIcon from "../../assets/images/add-icon-secondary.svg";
import { actions } from "../../slices/projects";
import { makeStyles } from "@mui/styles";
import AppModal from "../../components/AppModal";
import AppTextbox from "../../components/AppTextbox";
import { Action, Input } from "../../declarations/interface";
import { createInput, updateInput } from "../../slices/project";
import { DEFAULT_INPUT } from "../../util/constants";
import { AppSelect } from "../../components/AppSelect";

const useStyles = makeStyles((theme) => ({
  input: {
    "& input": {
      height: "38px !important",
    },
  },
}));
const MAX_LIMIT = 250;
type NameErrorKey = "REQUIRED" | "MAX_LIMIT";
type WaitAfterActionErrorKey = "INVALID";
type ValueErrorKey = "MAX_LIMIT";

type NameError = {
  [key in NameErrorKey]?: string;
};

type WaitAfterActionError = {
  [key in WaitAfterActionErrorKey]?: string;
};

type ValueError = {
  [key in ValueErrorKey]?: string;
};

type ErrorMsg = {
  name: NameError;
  waitAfterAction: WaitAfterActionError;
  value: ValueError;
};

const errorMsg: ErrorMsg = {
  name: {
    REQUIRED: "This field is required",
    MAX_LIMIT: `Maximum limit is ${MAX_LIMIT} characters`,
  },
  waitAfterAction: {
    INVALID: "Invalid duration"
  },
  value: {
    MAX_LIMIT: `Maximum limit is ${MAX_LIMIT} characters`,
  },
};

export const AddInput: React.FC<{
  input?: Input;
  action: Action;
  onModalClose: () => void;
}> = ({ input, action, onModalClose }) => {
  const classes = useStyles();
  const [data, setData] = useState<Input | undefined>();
  const [modalOpen, setModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [nameError, setNameError] = useState<
    NameErrorKey | undefined
  >();
  const [waitAfterActionError, setWaitAfterActionError] = useState<
    WaitAfterActionErrorKey | undefined
  >();
  const [valueError, setValueError] = useState<
    ValueErrorKey | undefined
  >();
  const [title, setTitle] = useState("Add Input");

  const dispatch = useDispatch();

  const handleModalOpen = () => {
    setData({ ...DEFAULT_INPUT, actionId: action.id });
  };
  const handleModalClose = () => {
    setModalOpen(false);
    setNameError(undefined);
    setWaitAfterActionError(undefined);
    setValueError(undefined);
    onModalClose();
    dispatch(actions.clearStatus());
  };
  const handleSubmit = () => {
    handleFieldChange({target:{value: data?.name}}, "name")
    handleFieldChange({target:{value: data?.waitAfterAction}}, "waitAfterAction")
    handleFieldChange({target:{value: data?.value}}, "value")
    setSubmitted(true);
  };
  const submitData = () => {
    setModalOpen(false);
    setSubmitted(false);
    if (data?.id.length) {
      dispatch(updateInput(data));
    } else {
      dispatch(createInput(data));
    }
  };

  const handleFieldChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent | any,
    field: keyof Input
  ) => {
    const value = event.target.value;
    if (field === "name") {
      validateName(value);
    }
    if (field === "waitAfterAction") {
      validatWaitAfterAction(value);
    }
    if (field === "value") {
      validateValue(value);
    }
    setData((prev) => {
      if (prev)
        return {
          ...prev,
          [field]: event.target.value,
        };
    });
  };

  const validatWaitAfterAction = (waitAfterAction: number) => {
    if (isNaN(waitAfterAction)) {
      setWaitAfterActionError("INVALID");
    } else {
      setWaitAfterActionError(undefined);
    }
  };

  const validateValue = (value: string) => {
    if (value.length > MAX_LIMIT) {
      setValueError("MAX_LIMIT");
    } else {
      setValueError(undefined);
    }
  };

  const validateName = (name: string) => {
    if (name.length > MAX_LIMIT) {
      setNameError("MAX_LIMIT");
    } else if (name.length === 0) {
      setNameError("REQUIRED");
    } else {
      setNameError(undefined);
    }
  };

  useEffect(() => {
    setData(input);
  }, [input]);

  useEffect(() => {
    if (data) {
      setModalOpen(true);
    }
  }, [data]);

  useEffect(() => {
    if (data?.id.length) {
      setTitle("Update Input");
    } else {
      setTitle("Add Input");
    }
  }, [modalOpen, data]);

  useEffect(() => {
    if(!!nameError || !!waitAfterActionError || !!valueError) return
    if (submitted) submitData();
  }, [submitted]);

  return (
    <Box>
      <Tooltip title={"Add new input for this action"}>
        <IconButton
          sx={{ padding: 0.5 }}
          onClick={handleModalOpen}
          data-testid="add-another-replacement"
        >
          <img src={AddIcon} alt="close" />
        </IconButton>
      </Tooltip>
      <AppModal
        open={modalOpen}
        onClose={handleModalClose}
        header={
          <Typography
            variant="h5"
            color="primaryHighlight.main"
            sx={{ fontWeight: 600 }}
          >
            {title}
          </Typography>
        }
      >
        {data && (
          <Box mb={0.5}>
            <Box>
              <AppTextbox
                label="Name"
                placeholder="Enter Name"
                value={data.name}
                onChange={(event) => {
                  handleFieldChange(event, "name");
                }}
                classes={{ root: classes.input }}
                error={!!nameError}
                helperText={
                  nameError ? errorMsg.name[nameError] : ""
                }
              />
            </Box>
            <Box mt={2}>
              <AppTextbox
                label="Wait duration after action (in sec)"
                placeholder="Enter Wait duration after action"
                value={data.waitAfterAction}
                onChange={(event) => {
                  handleFieldChange(event, "waitAfterAction");
                }}
                classes={{ root: classes.input }}
                error={!!waitAfterActionError}
                helperText={
                  waitAfterActionError ? errorMsg.waitAfterAction[waitAfterActionError] : ""
                }
                type="number"
              />
            </Box>
            <Box mt={2}>
              {(action.type === "SET_CHECKBOX_VALUE" || action.type === "SET_RADIO_VALUE") &&<AppSelect
                id={`input-value-dropdown`}
                value={data.value ?? ""}
                onChange={(event) => {
                  handleFieldChange(event, "value");
                }}
                error={!!valueError}
                helperText={
                  valueError ? errorMsg.value[valueError] : ""
                }
                options={[{label:"Select",value:"SELECT"},{label:"Unselect",value:"UN_SELECT"}]}
                label="Select Input" />}
              {(action.type === "LAUNCH_BROWSER" || action.type === "TYPE_TEXT") &&<AppTextbox
                label="Value"
                placeholder="Enter Value"
                value={data.value}
                onChange={(event) => {
                  handleFieldChange(event, "value");
                }}
                classes={{ root: classes.input }}
                error={!!valueError}
                helperText={
                  valueError ? errorMsg.value[valueError] : ""
                }
              />}
            </Box>
            <Box mt={2.75}>
              <Button
                variant="contained"
                color="secondary"
                sx={{
                  padding: 1.5,
                }}
                onClick={handleSubmit}
                fullWidth
                aria-label={title}
                disabled={!!nameError || !!waitAfterActionError || !!valueError}
              >
                <Typography variant="h5" sx={{ textTransform: "capitalize" }}>
                  {title}
                </Typography>
              </Button>
            </Box>
          </Box>
        )}
      </AppModal>
    </Box>
  );
};

export default AddInput;

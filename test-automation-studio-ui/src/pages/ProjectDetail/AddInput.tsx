import React, { useState, ChangeEvent, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Typography, Button, Box, Tooltip, TextField, IconButton, SelectChangeEvent, Select, MenuItem, InputLabel } from "@mui/material";
import AddIcon from "../../assets/images/add-icon-secondary.svg";
import { actions } from "../../slices/projects";
import { makeStyles } from "@mui/styles";
import AppModal from "../../components/AppModal";
import AppTextbox from "../../components/AppTextbox";
import { Input } from "../../declarations/interface";
import { ACTION_TYPES, DEFAULT_INPUT } from "./ActionContainer";
import { createInput, updateInput } from "../../slices/project";
import { AppSelect2 } from "../../components/AppSelect";

const useStyles = makeStyles((theme) => ({
  input: {
    "& input": {
      height: "38px !important",
    },
  },
}));
const MAX_LIMIT = 250;
type NameErrorKey = "REQUIRED" | "MAX_LIMIT";
type TypeErrorKey = "REQUIRED";
type XpathErrorKey = "MAX_LIMIT" | "INVALID" | "MAX_LIMIT";
type ValueErrorKey = "MAX_LIMIT";

type NameError = {
  [key in NameErrorKey]?: string;
};

type TypeError = {
  [key in TypeErrorKey]?: string;
};

type XpathError = {
  [key in XpathErrorKey]?: string;
};

type ValueError = {
  [key in ValueErrorKey]?: string;
};

type ErrorMsg = {
  name: NameError;
  type: TypeError;
  xpath: XpathError;
  value: ValueError;
};

const errorMsg: ErrorMsg = {
  name: {
    REQUIRED: "This field is required",
    MAX_LIMIT: `Maximum limit is ${MAX_LIMIT} characters`,
  },
  type: {
    REQUIRED: "This field is required",
  },
  xpath: {
    MAX_LIMIT: `Maximum limit is ${MAX_LIMIT} characters`,
    INVALID: "Invalid xpath"
  },
  value: {
    MAX_LIMIT: `Maximum limit is ${MAX_LIMIT} characters`,
  },
};

const AddInput: React.FC<{
  input?: Input;
  actionId: string;
  onModalClose: () => void;
}> = ({ input, actionId, onModalClose }) => {
  const classes = useStyles();
  const [data, setData] = useState<Input | undefined>();
  const [modalOpen, setModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [nameError, setNameError] = useState<
    NameErrorKey | undefined
  >();
  const [typeError, setTypeError] = useState<
    TypeErrorKey | undefined
  >();
  const [xpathError, setXpathError] = useState<
    XpathErrorKey | undefined
  >();
  const [valueError, setValueError] = useState<
    ValueErrorKey | undefined
  >();
  const [title, setTitle] = useState("Add Input");

  const dispatch = useDispatch();

  const handleModalOpen = () => {
    setData({ ...DEFAULT_INPUT, actionId: actionId });
  };
  const handleModalClose = () => {
    setModalOpen(false);
    setNameError(undefined);
    setTypeError(undefined);
    setXpathError(undefined);
    setValueError(undefined);
    onModalClose();
    dispatch(actions.clearStatus());
  };
  const handleSubmit = () => {
    handleFieldChange({target:{value: data?.name}}, "name")
    handleFieldChange({target:{value: data?.type}}, "type")
    handleFieldChange({target:{value: data?.xpath}}, "xpath")
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
    if (field === "type") {
      validateType(value);
    }
    if (field === "xpath") {
      validateXpath(value);
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

  const isValidXpath = (xpath: string): boolean => {
    // valida this xpath properly
    return true;
    try {
      document.querySelector(xpath);
      return true;
    } catch (error) {
      console.log("invalid")
      return false;
    }
  };

  const validateXpath = (xpath: string) => {
    if (xpath.length > 250) {
      setXpathError("MAX_LIMIT");
    } else if (!isValidXpath(xpath)) {
      setXpathError("INVALID");
    } else {
      setXpathError(undefined);
    }
  };

  const validateType = (type: string) => {
    if (type.length === 0) {
      setTypeError("REQUIRED");
    } else {
      setTypeError(undefined);
    }
  };

  const validateValue = (value: string) => {
    if (value.length > 250) {
      setXpathError("MAX_LIMIT");
    } else {
      setXpathError(undefined);
    }
  };

  const validateName = (name: string) => {
    if (name.length > 250) {
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
    if(!!nameError || !!typeError || !!xpathError || !!valueError) return
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
              <AppSelect2
                id={`action-type-dropdown`}
                value={data.type}
                onChange={(event) => {
                  handleFieldChange(event, "type");
                }} options={ACTION_TYPES} label="Select Action Type" />
            </Box>
            <Box mt={2}>
              <AppTextbox
                placeholder="Enter Xpath"
                value={data.xpath}
                onChange={(event) => {
                  handleFieldChange(event, "xpath");
                }}
                classes={{ root: classes.input }}
                error={!!xpathError}
                helperText={
                  xpathError ? errorMsg.xpath[xpathError] : ""
                }
              />
            </Box>
            <Box mt={2}>
              <AppTextbox
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
              />
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
                disabled={!!nameError || !!typeError || !!xpathError || !!valueError}
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

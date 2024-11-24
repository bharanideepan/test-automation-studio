import React, { useState, ChangeEvent, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Typography, Button, Box, Tooltip, TextField, IconButton, SelectChangeEvent } from "@mui/material";
import AddIcon from "../../assets/images/add-icon-secondary.svg";
import { actions } from "../../slices/projects";
import { makeStyles } from "@mui/styles";
import AppModal from "../../components/AppModal";
import AppTextbox from "../../components/AppTextbox";
import { Action } from "../../declarations/interface";
import { createAction, updateAction } from "../../slices/project";
import AppSelect, { AppGroupSelect } from "../../components/AppSelect";
import { ACTION_TYPES, DEFAULT_ACTION } from "../../util/constants";
import { RootState } from "../../store/rootReducer";

const useStyles = makeStyles((theme) => ({
  input: {
    "& input": {
      height: "38px !important",
    },
  },
}));
const MAX_LIMIT = 250;
type ActionErrorKey = "REQUIRED" | "MAX_LIMIT";
type TypeErrorKey = "REQUIRED";
type XpathErrorKey = "REQUIRED" | "INVALID";
type ValueRegexErrorKey = "INVALID";

type NameError = {
  [key in ActionErrorKey]?: string;
};

type TypeError = {
  [key in TypeErrorKey]?: string;
};

type XpathError = {
  [key in XpathErrorKey]?: string;
};

type ValueRegexError = {
  [key in ValueRegexErrorKey]?: string;
};

type ErrorMsg = {
  name: NameError;
  type: TypeError;
  xpath: XpathError;
  valueRegex: ValueRegexError;
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
    REQUIRED: "This field is required",
  },
  valueRegex: {
    INVALID: `Invalid regex`,
  },
};

const AddAction: React.FC<{
  action?: Action;
  projectId: string;
  onModalClose: () => void;
}> = ({ action, projectId, onModalClose }) => {
  const classes = useStyles();
  const [data, setData] = useState<Action | undefined>();
  const [modalOpen, setModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { pages, status } = useSelector((state: RootState) => state.pages);

  const [nameError, setNameError] = useState<
    ActionErrorKey | undefined
  >();
  const [typeError, setTypeError] = useState<
    TypeErrorKey | undefined
  >();
  const [xpathError, setXpathError] = useState<
    XpathErrorKey | undefined
  >();
  const [valueRegexError, setValueRegexError] = useState<
    ValueRegexErrorKey | undefined
  >();
  const [title, setTitle] = useState("Add Action");

  const dispatch = useDispatch();

  const handleModalOpen = () => {
    setData({ ...DEFAULT_ACTION, projectId: projectId });
  };
  const handleModalClose = () => {
    setModalOpen(false);
    setNameError(undefined);
    setTypeError(undefined);
    setXpathError(undefined);
    setValueRegexError(undefined);
    onModalClose();
    setData(undefined)
    dispatch(actions.clearStatus());
  };
  const handleSubmit = () => {
    handleFieldChange({ target: { value: data?.name ?? "" } }, "name")
    handleFieldChange({ target: { value: data?.type ?? "" } }, "type")
    handleFieldChange({ target: { value: data?.selectorId ?? "" } }, "selectorId")
    handleFieldChange({ target: { value: data?.valueRegex ?? "" } }, "valueRegex")
    setSubmitted(true);
  };
  const submitData = () => {
    setModalOpen(false);
    setSubmitted(false);
    if (data?.id.length) {
      dispatch(updateAction(data));
    } else {
      dispatch(createAction(data));
    }
  };
  const handleFieldChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent | any,
    field: keyof Action
  ) => {
    setSubmitted(false);
    const value = event.target.value;
    if (field === "name") {
      validateName(value);
    }
    if (field === "type") {
      validateType(value);
      if (data) validateXpath(data.selectorId, value);
    }
    if (field === "selectorId") {
      validateXpath(value, data?.type ?? "");
    }
    if (field === "valueRegex") {
      validateValueRegex(value);
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
    // validate this xpath properly
    return true;
    try {
      document.querySelector(xpath);
      return true;
    } catch (error) {
      console.log("invalid")
      return false;
    }
  };

  const isValidValueRegex = (valueRegex: string): boolean => {
    // validate this regex properly
    return true;
  };

  const validateXpath = (xpath: string, type: string) => {
    xpath = xpath ?? "";
    if (xpath?.length === 0 && (type !== "LAUNCH_BROWSER" && type !== "NEW_PAGE")) {
      setXpathError("REQUIRED");
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

  const validateValueRegex = (valueRegex: string) => {
    if (!isValidValueRegex(valueRegex)) {
      setValueRegexError("INVALID");
    } else {
      setValueRegexError(undefined);
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
    setData(action);
  }, [action]);

  useEffect(() => {
    if (data) {
      setModalOpen(true);
    }
  }, [data]);

  useEffect(() => {
    if (data?.id.length) {
      setTitle("Update Action");
    } else {
      setTitle("Add Action");
    }
  }, [modalOpen, data]);

  useEffect(() => {
    if (!!nameError || !!typeError || !!xpathError || !!valueRegexError) return
    if (submitted) submitData();
  }, [submitted]);

  return (
    <Box>
      <Tooltip title={"Add new action for this project"}>
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
              <AppSelect
                id={`action-type-dropdown`}
                value={data.type}
                onChange={(event) => {
                  handleFieldChange(event, "type");
                }}
                error={!!typeError}
                helperText={
                  typeError ? errorMsg.type[typeError] : ""
                }
                options={ACTION_TYPES} label="Select Action Type" />
            </Box>
            {(data.type !== "LAUNCH_BROWSER" && data.type !== "NEW_PAGE") && <Box mt={2}>
              <AppGroupSelect
                id={`xpath-dropdown`}
                value={data.selectorId ?? ""}
                onChange={(event) => {
                  handleFieldChange(event, "selectorId");
                }}
                error={!!xpathError}
                helperText={
                  xpathError ? errorMsg.xpath[xpathError] : ""
                }
                options={
                  pages?.map((page) => ({
                    category: page.name,
                    options: page.selectors?.map((selector) => ({ label: `${selector.name} - ${selector.xpath}`, value: selector.id })) ?? []
                  })) ?? []
                } label="Select Xpath" />
              {/* <AppTextbox
                label="Xpath"
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
              /> */}
            </Box>}
            {(data.type !== "LAUNCH_BROWSER" && data.type !== "NEW_PAGE") && <Box mt={2}>
              <AppTextbox
                label="Value Regex"
                placeholder="Enter Value Regex"
                value={data.valueRegex}
                onChange={(event) => {
                  handleFieldChange(event, "valueRegex");
                }}
                classes={{ root: classes.input }}
                error={!!valueRegexError}
                helperText={
                  valueRegexError ? errorMsg.valueRegex[valueRegexError] : ""
                }
              />
            </Box>}
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
                disabled={!!nameError || !!typeError || !!xpathError || !!valueRegexError}
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

export default AddAction;

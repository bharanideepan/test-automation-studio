import React, { useState, ChangeEvent, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Typography, Button, Box, Tooltip, TextField, IconButton, SelectChangeEvent, Select, MenuItem } from "@mui/material";
import AddIcon from "../../assets/images/add-icon-secondary.svg";
import { makeStyles } from "@mui/styles";
import AppModal from "../../components/AppModal";
import AppTextbox from "../../components/AppTextbox";
import { Page, Selector } from "../../declarations/interface";
import { actions, createSelector, updateSelector } from "../../slices/pages";
import { DEFAULT_SELECTOR } from "../../util/constants";
import { AppSelect } from "../../components/AppSelect";

const useStyles = makeStyles((theme) => ({
  selector: {
    "& selector": {
      height: "38px !important",
    },
  },
}));
const MAX_LIMIT = 250;
type NameErrorKey = "REQUIRED" | "MAX_LIMIT";
type XpathErrorKey = "REQUIRED";

type NameError = {
  [key in NameErrorKey]?: string;
};

type XpathError = {
  [key in XpathErrorKey]?: string;
};

type ErrorMsg = {
  name: NameError;
  xpath: XpathError;
};

const errorMsg: ErrorMsg = {
  name: {
    REQUIRED: "This field is required",
    MAX_LIMIT: `Maximum limit is ${MAX_LIMIT} characters`,
  },
  xpath: {
    REQUIRED: "This field is required",
  },
};

export const AddSelector: React.FC<{
  selector?: Selector;
  page: Page;
  onModalClose: () => void;
}> = ({ selector, page, onModalClose }) => {
  const classes = useStyles();
  const [data, setData] = useState<Selector | undefined>();
  const [modalOpen, setModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [nameError, setNameError] = useState<
    NameErrorKey | undefined
  >();
  const [xpathError, setXpathError] = useState<
    XpathErrorKey | undefined
  >();
  const [title, setTitle] = useState("Add Selector");

  const dispatch = useDispatch();

  const handleModalOpen = () => {
    setData({ ...DEFAULT_SELECTOR, pageId: page.id });
  };
  const handleModalClose = () => {
    setModalOpen(false);
    setNameError(undefined);
    setXpathError(undefined);
    onModalClose();
    dispatch(actions.clearStatus());
  };
  const handleSubmit = () => {
    handleFieldChange({ target: { value: data?.name } }, "name")
    handleFieldChange({ target: { value: data?.xpath } }, "xpath")
    setSubmitted(true);
  };
  const submitData = () => {
    setModalOpen(false);
    setSubmitted(false);
    if (data?.id.length) {
      dispatch(updateSelector(data));
    } else {
      dispatch(createSelector(data));
    }
  };

  const handleFieldChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent | any,
    field: keyof Selector
  ) => {
    setSubmitted(false);
    const value = event.target.value;
    if (field === "name") {
      validateName(value);
    }
    if (field === "xpath") {
      validateXpath(value);
    }
    setData((prev) => {
      if (prev)
        return {
          ...prev,
          [field]: event.target.value,
        };
    });
  };

  const validateXpath = (value: string) => {
    if (value.length === 0) {
      setXpathError("REQUIRED");
    } else {
      setXpathError(undefined);
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
    setData(selector);
  }, [selector]);

  useEffect(() => {
    if (data) {
      setModalOpen(true);
    }
  }, [data]);

  useEffect(() => {
    if (data?.id.length) {
      setTitle("Update Selector");
    } else {
      setTitle("Add Selector");
    }
  }, [modalOpen, data]);

  useEffect(() => {
    if (!!nameError || !!xpathError) return
    if (submitted) submitData();
  }, [submitted]);

  return (
    <Box>
      <Tooltip title={"Add new selector for this page"}>
        <IconButton
          sx={{ padding: 0.5 }}
          onClick={handleModalOpen}
          data-testid="add-another-selector"
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
                classes={{ root: classes.selector }}
                error={!!nameError}
                helperText={
                  nameError ? errorMsg.name[nameError] : ""
                }
              />
            </Box>
            <Box mt={2}>
              <AppTextbox
                label="Xpath"
                placeholder="Enter Xpath"
                value={data.xpath}
                onChange={(event) => {
                  handleFieldChange(event, "xpath");
                }}
                classes={{ root: classes.selector }}
                error={!!xpathError}
                helperText={
                  xpathError ? errorMsg.xpath[xpathError] : ""
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
                disabled={!!nameError || !!xpathError}
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

export default AddSelector;

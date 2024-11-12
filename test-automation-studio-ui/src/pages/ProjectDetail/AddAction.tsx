import React, { useState, ChangeEvent, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Typography, Button, Box, Tooltip, TextField, IconButton } from "@mui/material";
import AddIcon from "../../assets/images/add-icon-secondary.svg";
import { actions } from "../../slices/projects";
import { makeStyles } from "@mui/styles";
import AppModal from "../../components/AppModal";
import AppTextbox from "../../components/AppTextbox";
import { Action } from "../../declarations/interface";
import { DEFAULT_ACTION } from "./ActionContainer";
import { createAction, updateAction } from "../../slices/project";

const useStyles = makeStyles((theme) => ({
  input: {
    "& input": {
      height: "38px !important",
    },
  },
}));
const MAX_LIMIT = 250;
type ActionErrorKey = "REQUIRED" | "MAX_LIMIT";

type NameError = {
  [key in ActionErrorKey]?: string;
};

type ErrorMsg = {
  name: NameError;
};

const errorMsg: ErrorMsg = {
  name: {
    REQUIRED: "This field is required",
    MAX_LIMIT: `Maximum limit is ${MAX_LIMIT} characters`,
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

  const [nameError, setNameError] = useState<
    ActionErrorKey | undefined
  >();
  const [title, setTitle] = useState("Add Action");

  const dispatch = useDispatch();

  const handleModalOpen = () => {
    setData({ ...DEFAULT_ACTION, projectId: projectId });
  };
  const handleModalClose = () => {
    setModalOpen(false);
    setNameError(undefined);
    onModalClose();
    dispatch(actions.clearStatus());
  };
  const handleSubmit = () => {
    handleFieldChange({target:{value: data?.name}}, "name")
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
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any,
    field: keyof Action
  ) => {
    const value = event.target.value;
    if (field === "name") {
      validateName(value);
    }
    setData((prev) => {
      if (prev)
        return {
          ...prev,
          [field]: event.target.value,
        };
    });
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
    if(nameError) return
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
                disabled={!!nameError}
              // disabled={!!nameError || !!selectorError}
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

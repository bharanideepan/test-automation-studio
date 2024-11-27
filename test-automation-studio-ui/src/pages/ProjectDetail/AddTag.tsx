import React, { useState, ChangeEvent, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Typography, Button, Box, Tooltip, IconButton, SelectChangeEvent } from "@mui/material";
import AddIcon from "../../assets/images/add-icon-secondary.svg";
import { makeStyles } from "@mui/styles";
import AppModal from "../../components/AppModal";
import AppTextbox from "../../components/AppTextbox";
import { Tag } from "../../declarations/interface";
import { actions, createTag, updateTag } from "../../slices/tags";
import { DEFAULT_TAG } from "../../util/constants";

const useStyles = makeStyles((theme) => ({
  input: {
    "& input": {
      height: "38px !important",
    },
  },
}));
const MAX_LIMIT = 250;
type TagErrorKey = "REQUIRED" | "MAX_LIMIT";

type NameError = {
  [key in TagErrorKey]?: string;
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

const AddTag: React.FC<{
  tag?: Tag;
  projectId: string;
  onModalClose: () => void;
}> = ({ tag, projectId, onModalClose }) => {
  const classes = useStyles();
  const [data, setData] = useState<Tag | undefined>();
  const [modalOpen, setModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [nameError, setNameError] = useState<
    TagErrorKey | undefined
  >();
  const [title, setTitle] = useState("Add Tag");

  const dispatch = useDispatch();

  const handleModalOpen = () => {
    setData({ ...DEFAULT_TAG, projectId: projectId });
  };
  const handleModalClose = () => {
    setModalOpen(false);
    setNameError(undefined);
    onModalClose();
    setData(undefined)
    dispatch(actions.clearStatus());
  };
  const handleSubmit = () => {
    handleFieldChange({ target: { value: data?.name ?? "" } }, "name")
    setSubmitted(true);
  };
  const submitData = () => {
    setModalOpen(false);
    setSubmitted(false);
    if (data?.id.length) {
      dispatch(updateTag(data));
    } else {
      dispatch(createTag(data));
    }
  };
  const handleFieldChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent | any,
    field: keyof Tag
  ) => {
    setSubmitted(false);
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
    if (name.length > MAX_LIMIT) {
      setNameError("MAX_LIMIT");
    } else if (name.length === 0) {
      setNameError("REQUIRED");
    } else {
      setNameError(undefined);
    }
  };

  useEffect(() => {
    setData(tag);
  }, [tag]);

  useEffect(() => {
    if (data) {
      setModalOpen(true);
    }
  }, [data]);

  useEffect(() => {
    if (data?.id.length) {
      setTitle("Update Tag");
    } else {
      setTitle("Add Tag");
    }
  }, [modalOpen, data]);

  useEffect(() => {
    if (nameError) return
    if (submitted) submitData();
  }, [submitted]);

  return (
    <Box>
      <Tooltip title={"Add new tag for this project"}>
        <IconButton
          sx={{ padding: 0.5 }}
          onClick={handleModalOpen}
          data-testid="add-another-tag"
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

export default AddTag;
